export function saveToLocalStorage(key: string, data: any) {
    try {
        localStorage.setItem(key, JSON.stringify(data))
        console.log("ローカルストレージに保存しました。")
        console.log(data)
    } catch (error) {
        console.error("ローカルストレージへの保存に失敗しました。")
    }
}