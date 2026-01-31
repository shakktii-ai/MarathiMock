// Data for video recommendations based on assessment performance
// Categoreis: MCQ (Technical), Communication, Aptitude (Personality/Situational)

export const videoDatabase = {
    mcq: [
        {
            id: "mcq_basics_1",
            title: "Electronics Basics for Beginners",
            url: "https://www.youtube.com/watch?v=re9X0XfT0NI", // Example URL
            thumbnail: "https://img.youtube.com/vi/re9X0XfT0NI/mqdefault.jpg",
            topic: "सामान्य",
            difficulty: "सुरुवातीचे",
            description: "तुमची तांत्रिक धावसंख्या सुधारण्यासाठी इलेक्ट्रॉनिक्सच्या मूलभूत संकल्पना शिका."
        },
        {
            id: "mcq_pcb_1",
            title: "PCB Design Process Explained",
            url: "https://www.youtube.com/watch?v=35j2rY3b1s8",
            thumbnail: "https://img.youtube.com/vi/35j2rY3b1s8/mqdefault.jpg",
            topic: "PCB",
            difficulty: "मध्यम",
            description: "डिझाइन समजून घेण्यासाठी पीसीबी निर्मिती प्रक्रियेचा सखोल अभ्यास करा."
        },
        {
            id: "mcq_general_v1",
            title: "Interview Preparation Guide",
            url: "https://www.youtube.com/watch?v=SEO9YPzSH-0",
            thumbnail: "https://img.youtube.com/vi/SEO9YPzSH-0/mqdefault.jpg",
            topic: "General",
            difficulty: "सुरुवातीचे",
            description: "तुमची मुलाखत तयारी आणि आत्मविश्वास वाढवण्यासाठी मार्गदर्शक."
        }
    ],
    communication: [
        {
            id: "comm_basic_1",
            title: "Effective Communication Skills",
            url: "https://www.youtube.com/watch?v=HAnw168huqA",
            thumbnail: "https://img.youtube.com/vi/HAnw168huqA/mqdefault.jpg",
            difficulty: "सुरुवातीचे",
            thresholdStars: 1, // Suggest if stars <= 1
            description: "स्पष्ट आणि आत्मविश्वासपूर्ण संभाषणाच्या मूलभूत गोष्टींवर प्रभुत्व मिळवा."
        },
        {
            id: "comm_inter_1",
            title: "Professional Workplace Communication",
            url: "https://www.youtube.com/watch?v=2X7S7CF-hgw", // Placeholder
            thumbnail: "https://img.youtube.com/vi/2X7S7CF-hgw/mqdefault.jpg",
            difficulty: "मध्यम",
            thresholdStars: 2, // Suggest if stars <= 2
            description: "व्यावसायिक वातावरणात प्रभावीपणे संवाद कसा साधावा हे शिका."
        },
        {
            id: "comm_general_v2",
            title: "Soft Skills Training",
            url: "https://www.youtube.com/watch?v=AH7k3P6W7V8",
            thumbnail: "https://img.youtube.com/vi/AH7k3P6W7V8/mqdefault.jpg",
            difficulty: "सुरुवातीचे",
            thresholdStars: 3,
            description: "तुमच्या व्यक्तिमत्व विकासासाठी आणि सॉफ्ट स्किल्ससाठी आवश्यक."
        }
    ],
    aptitude: [
        {
            id: "apt_situation_1",
            title: "Situational Judgment Test Tips",
            url: "https://www.youtube.com/watch?v=M2_o3s9_c2I", // Placeholder
            thumbnail: "https://img.youtube.com/vi/M2_o3s9_c2I/mqdefault.jpg",
            difficulty: "सुरुवातीचे",
            thresholdScore: 40, // Suggest if score <= 40%
            description: "कामाच्या ठिकाणी परिस्थिती आणि निर्णयाचे प्रश्न हाताळण्यासाठी धोरणे."
        },
        {
            id: "apt_logic_1",
            title: "Logical Reasoning for Interviews",
            url: "https://www.youtube.com/watch?v=9L9_j9l3j8I", // Placeholder
            thumbnail: "https://img.youtube.com/vi/9L9_j9l3j8I/mqdefault.jpg",
            difficulty: "मध्यम",
            thresholdScore: 70,
            description: "चांगल्या निर्णयासाठी तुमची तार्किक विचार कौशल्ये धारदार करा."
        }
    ]
};

// Helper to get suggestions
// Helper to get suggestions
export const getVideoSuggestions = (scores, subject = '') => {
    const suggestions = [];
    const normalizedSubject = subject ? subject.toLowerCase() : '';

    // 1. MCQ Suggestions (Technical)
    // Filter videos that match the subject/topic
    const mcqPercentage = (scores.mcq / 20) * 100;
    if (mcqPercentage < 60) {
        // Find specific video for the subject
        let relevantVideo = videoDatabase.mcq.find(v =>
            v.topic && normalizedSubject.includes(v.topic.toLowerCase())
        );

        // Fallback to General/First if no specific match
        if (!relevantVideo) {
            relevantVideo = videoDatabase.mcq.find(v => v.topic === "General") || videoDatabase.mcq[0];
        }

        if (relevantVideo) {
            suggestions.push({
                ...relevantVideo,
                reason: `तुमच्या ${subject || 'तांत्रिक'} विषयातील गुणांवर आधारित (< ६०%)`
            });
        }
    }

    // 2. Communication Suggestions
    // Logic: Suggest if score is low, prioritize difficulty based on score level
    const commStars = (scores.communication / 20) * 3;
    if (commStars < 3) {
        // Simple logic: Low score -> Basic video, Med score -> Intermediate
        const targetDifficulty = commStars < 1.5 ? "सुरुवातीचे" : "मध्यम";

        let commVideo = videoDatabase.communication.find(v => v.difficulty === targetDifficulty);
        if (!commVideo) commVideo = videoDatabase.communication[0];

        if (commVideo) {
            suggestions.push({
                ...commVideo,
                reason: "संभाषण कौशल्ये सुधारण्यासाठी शिफारस"
            });
        }
    }

    // 3. Aptitude Suggestions
    const aptPercentage = (scores.aptitude / 10) * 100;
    if (aptPercentage < 50) {
        let aptVideo = videoDatabase.aptitude[0];
        if (aptVideo) {
            suggestions.push({
                ...aptVideo,
                reason: "निर्णयक्षमता सुधारण्यासाठी"
            });
        }
    }

    return suggestions;
};