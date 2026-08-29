#include <napi.h>
#include <string>

// Khai báo lại hàm xử lý từ markdown_engine.cpp
std::string RenderMarkdownToHtml(const std::string& markdown, bool minify);

// --- 1. Worker xử lý Bất đồng bộ (AsyncWorker) ---
class MarkdownWorker : public Napi::AsyncWorker {
public:
    MarkdownWorker(Napi::Function& callback, std::string markdown, bool minify)
        : Napi::AsyncWorker(callback), markdown_(markdown), minify_(minify), result_("") {}

    ~MarkdownWorker() {}

    // Chạy ở luồng riêng (Background thread), không làm nghẽn Event Loop của Node.js
    void Execute() override {
        result_ = RenderMarkdownToHtml(markdown_, minify_);
    }

    // Chạy ở luồng chính khi Execute() hoàn tất
    void OnOK() override {
        Napi::HandleScope scope(Env());
        Callback().Call({Env().Null(), Napi::String::New(Env(), result_)});
    }

private:
    std::string markdown_;
    bool minify_;
    std::string result_;
};

// --- 2. Hàm Bất đồng bộ xuất ra JS (Trả về Promise) ---
Napi::Value MdToHtmlAsync(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    std::string markdown = "";
    if (info.Length() > 0 && info[0].IsString()) {
        markdown = info[0].As<Napi::String>().Utf8Value();
    }

    bool minify = false;
    if (info.Length() > 1 && info[1].IsBoolean()) {
        minify = info[1].As<Napi::Boolean>().Value();
    }

    Napi::Promise::Deferred deferred = Napi::Promise::Deferred::New(env);

    // Tạo callback tạm thời để resolve Promise khi Worker hoàn thành
    Napi::Function callback = Napi::Function::New(env, [deferred](const Napi::CallbackInfo& cbInfo) mutable {
        Napi::Env env = cbInfo.Env();
        if (cbInfo[0].IsNull()) {
            deferred.Resolve(cbInfo[1]);
        } else {
            deferred.Reject(cbInfo[0]);
        }
        return env.Undefined();
    });

    MarkdownWorker* worker = new MarkdownWorker(callback, markdown, minify);
    worker->Queue();

    return deferred.Promise();
}

// --- 3. Hàm Đồng bộ xuất ra JS ---
Napi::Value SyncMdToHtml(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    std::string markdown = "";
    if (info.Length() > 0 && info[0].IsString()) {
        markdown = info[0].As<Napi::String>().Utf8Value();
    }

    bool minify = false;
    if (info.Length() > 1 && info[1].IsBoolean()) {
        minify = info[1].As<Napi::Boolean>().Value();
    }

    std::string html = RenderMarkdownToHtml(markdown, minify);
    return Napi::String::New(env, html);
}

// --- 4. Khởi tạo Module Addon ---
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "syncMdToHtml"), Napi::Function::New(env, SyncMdToHtml));
    exports.Set(Napi::String::New(env, "mdToHtml"), Napi::Function::New(env, MdToHtmlAsync));
    return exports;
}

NODE_API_MODULE(supporter_addon, Init)
