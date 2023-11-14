import OpenAI from "openai";

const openai = new OpenAI({ apiKey: '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' });

async function main() {
    const completion = await openai.chat.completions.create({ 
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
     }); 
     
     console.log(completion.choices[0]); 
    } 
    
    main();