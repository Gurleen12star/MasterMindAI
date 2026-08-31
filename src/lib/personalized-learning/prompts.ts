import { ModuleType } from "@/types/personalized-learning";

const prompts = {
    generateModules: (themeStudy: string) => {
        return `Please create a personalized study plan for the topic: '${themeStudy}'. You should create modules for the different subtopics to be covered.

            Instructions for module content:

            1. Each module should contain:
            - **Title**: A title that summarizes the focus of the module.
            - **Description**: A brief description of the content to be covered, rich in details and information.
            2. Limit the plan to **a maximum of 8 modules**.

            Return format:

            - The result should be returned in **valid JSON format**, strictly following the model below:

            [
            {
                "title": "Module Title",
                "description": "Brief description of the module."
            },
            {
                "title": "Module Title",
                "description": "Brief description of the module."
            }
            // ... other modules
            ]

            Important notes:

            - Make sure that **each value of the "title" and "description" key is in double quotes** and that the JSON is formatted correctly.
            - Do not add more than specified and ensure that the JSON is **valid and consistent**.

            **Expected response example:**

            [
            {
                "title": "Introduction to the Topic",
                "description": "This module introduces the basic concepts of the topic..."
            },
            {
                "title": "Important Subtopic",
                "description": "This module addresses the subtopic with focus on..."
            }
            ]

            Please return only the JSON as shown in the example above.`
    },
    generateModule: (module: ModuleType) => {
        return `Please generate the content for the module: '${module.title}'. Develop based on the description: '${module.description}', without straying from the topic.
            
            The content should be:

            1. Rich and informative, containing images to illustrate information when possible. When it's not possible to include images, provide a link to a related image.
            2. Structured in JSON format and should strictly follow the model below:

            [
            {
                "html": "<HTML elements here>"
            },
            {
                "html": "<other HTML elements here>"
            }
            ]

            Important notes:

            - **Only** elements inside the body (example: <h1>, <p>, <span>, etc.) should be included. 
            - Do not include <html>, <head>, or <body>.
            - **Each value of the "html" key must be a valid string** with properly escaped HTML content.
            - The JSON must be **valid and consistent** with the specified format, with double quotes in all correct places.
            - Do not add more than specified, and make sure the JSON is correctly formatted and without syntax errors.

            **Expected response example:**
            [
            {
                "html": "<h1>Module Title</h1><p>Module content...</p>"
            },
            {
                "html": "<h2>Subtitle</h2><p>More content...</p><img src='image_link' alt='image description'>"
            }
            ]

            Please return only the JSON as shown in the example above.`;
    }
};

export default prompts;