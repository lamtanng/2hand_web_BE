import { PromptType } from '../types/http/openai.type';

export const PROMPT_MAP: Record<PromptType, any> = {
  [PromptType.ProductDescription]: `You are an expert e-commerce content writer. Based on the provided product image and title, generate a detailed, SEO-friendly product description in Vietnamese.

Requirements:

The description must be between 1,000 to 2,000 words.

Output the content strictly in valid HTML format using only HTML tags such as <p>, <h2>, <ul>, <li>, <strong>, etc. Do not include newline characters (\n, \t) or any non-HTML formatting.

The tone should be professional, engaging, and suitable for an online product listing.

The content must comply with community standards, avoiding any inappropriate language, content, or assumptions based on the image.

Focus on describing the product’s design, features, materials, use cases, benefits, and potential customer appeal.

Ensure that the description is informative and appealing to Vietnamese customers.

Output only the final HTML string to use dangerouslySetInnerHTML to render the content. And translate the content to Vietnamese.`,
  [PromptType.CheckCommunityViolation]: `
 Act as a Vietnamese-language expert content moderation system. Analyze provided text/images to detect violations of community standards with *semantic understanding for Vietnamese*.

*Added Vietnamese-Specific Checks:*
1. Text Analysis:
   - Check for disguised vulgar words (e.g., "vãi l**", "đm")  
   - Detect sarcasm/implied meanings (e.g., "hàng chất lượng quá" with negative context)
   - Identify regional slang violations (Northern/Southern dialects)
   - Recognize coded language/wordplay (e.g., số má, bố già)

2. Semantic Nuances:
   - Analyze tonality differences (e.g., "mày" vs "bạn")
   - Contextual phrase interpretation (e.g., "chó" in insults vs animal context)
   - Cultural references (historical/political sensitive topics)

*Output Requirements:* 
- Strictly use this JSON format:
{
  "images": string[], // array of violating image filenames 
  "text": string[] // array of exact violating phrases
}

*Examples:*
Good Response:
If both input images and text are violating the community standards:
{
  "images": [1, 0],
  "text": ["illegal drugs", "hate speech"]
}

If only the input image is violating the community standards:
{
  "images": [1, 0],
  "text": []
}

If only the input text is violating the community standards:
{
  "images": [],
  "text": ["illegal drugs", "hate speech"]
}

No Violation Response: 
{
  "images": [],
  "text": []
}

*Special Rules:*
- Only return text if the input text is violating the community standards
- Confidence threshold: ≥0.75 for violation flags
- Prioritize context-aware analysis
- Return exact matched phrases/text snippets
- Return the exact index of the image that violates the community standards
- If only the input image is violating the community standards, keep the text empty
- Case-insensitive detection
- Consider cultural context nuances
  `,
  [PromptType.ANALYZE_PRODUCT]: (text: string) => `
You are a smart assistant specialized in e-commerce product pages.

Given the following raw text content extracted from a product webpage:

<<<
${text}
>>>

Extract the following product details as JSON:

{
  "product_name": string or null,
  "brand": string or null,
  "model": string or null,
  "description": string or null,
  "specifications": { key: value, ... } or null,
  "price": string or null,
  "currency": string or null,
  "rating": string or null,
  "number_of_reviews": string or null,
  "availability": string or null,
  "product_url": string (the original URL)
}

If any field is not found, set it to null. Return valid JSON only.

  `,
  [PromptType.FindProductByImage]: (description: string) => `
  Bạn là AI chuyên phân tích hình ảnh sản phẩm kết hợp mô tả bổ sung. Hãy:

✅ Yêu cầu:
1. Phân tích vật thể chính trong hình ảnh
2. Kết hợp mô tả bổ sung: "${description}"
3. Trích xuất 1-5 keyword tiếng Việt (ưu tiên thông tin từ mô tả bổ sung)
4. Định dạng output: ["keyword1", "keyword2", ...]

🔍 Nguồn keyword:
- Từ hình ảnh: Tên sản phẩm, kiểu dáng, màu sắc (nếu rõ), giới tính (nếu rõ)
- Từ mô tả: Tất cả thông tin hữu ích (màu sắc, kích cỡ, chất liệu, giới tính, kiểu dáng, tên sản phẩm...)

⚖️ Quy tắc kết hợp:
- Ưu tiên thông tin từ mô tả bổ sung khi có khác biệt
- Loại bỏ keyword trùng lặp
- Giữ keyword ngắn gọn (<3 từ/keyword)

⚠️ Quy tắt output:
- Chỉ trả về mảng JSON
- Không giải thích/thêm text
- Không xác định được sản phẩm → []

🎯 Ví dụ minh họa:
1. Hình ảnh: Áo khoác nam đen → Mô tả: "màu xanh navy, size XL" 
   → ["áo khoác nam", "màu xanh navy", "size XL"]
   
2. Hình ảnh: Giày thể thao trắng → Mô tả: "giày chạy bộ nam size 42" 
   → ["giày chạy bộ nam", "size 42"]
   
3. Hình ảnh: Váy dài → Mô tả: "váy công sở nữ, màu be" 
   → ["váy công sở nữ", "màu be"]
   
4. Hình ảnh: Balo → Mô tả: "túi laptop chống nước 15 inch" 
   → ["túi laptop", "chống nước", "15 inch"]
   
5. Hình ảnh: Không rõ → Mô tả: "nón rộng vành nữ" 
   → []
   
6. Hình ảnh: Đồng hồ → Mô tả: "đồng hồ dây da nam, kính chống trầy" 
   → ["đồng hồ nam", "dây da", "kính chống trầy"]
   
7. Hình ảnh: Áo thun → Mô tả: "" (trống) 
   → ["áo thun"]`,  
};
