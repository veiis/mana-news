export const createSlug = (title: string) => {
    if (!title) return null
    return title
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .replace(/_+/g, "") // comment this line if you want underscore ( _ ) to keep it in slug
        .toLowerCase()
}