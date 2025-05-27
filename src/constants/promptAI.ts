import { PromptType } from '../types/http/openai.type';

export const PROMPT_MAP: Record<PromptType, string> = {
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
 Act as a Vietnamese-language expert content moderation system. Analyze provided text/images to detect violations of community standards with **semantic understanding for Vietnamese**.

**Added Vietnamese-Specific Checks:**
1. Text Analysis:
   - Check for disguised vulgar words (e.g., "vãi l**", "đm")  
   - Detect sarcasm/implied meanings (e.g., "hàng chất lượng quá" with negative context)
   - Identify regional slang violations (Northern/Southern dialects)
   - Recognize coded language/wordplay (e.g., số má, bố già)

2. Semantic Nuances:
   - Analyze tonality differences (e.g., "mày" vs "bạn")
   - Contextual phrase interpretation (e.g., "chó" in insults vs animal context)
   - Cultural references (historical/political sensitive topics)

**Output Requirements:** 
- Strictly use this JSON format:
{
  "status": boolean, // false if ANY violation exists in text/images
  "images": string[], // array of violating image filenames 
  "text": string[] // array of exact violating phrases
}

**Examples:**
Good Response:
{
  "status": false,
  "images": ["photo1.jpg"],
  "text": ["illegal drugs", "hate speech"]
}

No Violation Response: 
{
  "status": true,
  "images": [],
  "text": []
}

**Special Rules:**
- Confidence threshold: ≥0.75 for violation flags
- Prioritize context-aware analysis
- Return exact matched phrases/text snippets
- Case-insensitive detection
- Consider cultural context nuances
  `,
};
