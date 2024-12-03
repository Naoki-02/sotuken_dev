import requests


def extract_text_with_api_key(image_path, api_key):
    """
    APIキーを使用してレシート画像からテキストを抽出。

    Args:
        image_path (str): レシート画像のパス。
        api_key (str): Google Vision API の APIキー。

    Returns:
        str: 抽出されたテキスト。
    """
    url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
    
    # 画像データをBase64エンコード
    import base64
    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")

    # リクエストデータの作成
    request_data = {
        "requests": [
            {
                "image": {"content": image_data},
                "features": [{"type": "TEXT_DETECTION"}]
            }
        ]
    }

    # APIリクエストを送信
    response = requests.post(url, json=request_data)

    # エラー処理
    if response.status_code != 200:
        return f"Error: {response.status_code}, {response.text}"

    # レスポンスからテキストを抽出
    response_data = response.json()
    try:
        text = response_data["responses"][0]["textAnnotations"][0]["description"]
    except (KeyError, IndexError):
        text = "No text detected."
    
    return text

if __name__ == "__main__":
    api_key = "AIzaSyCgOm3fNZ96SIYPIZrPn2NtkvIpr5wpB2c"  # APIキーをここに設定
    image_path = "re1.jpg"

    text = extract_text_with_api_key(image_path, api_key)
    print("Extracted Text:")
    print(text)
