import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Instruction() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  const handleStart = () => {
    router.push("/mock");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-20">
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-black mb-4">
            परीक्षा सूचना
          </h1>
          <p className="text-slate-400 text-sm">
            कृपया परीक्षा सुरू करण्यापूर्वी खालील सूचना काळजीपूर्वक वाचा.
          </p>
        </div>

        {/* Instruction Card */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-12 space-y-10">

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-3">
              1. टेक्निकल असेसमेंट (25 प्रश्न)
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              या विभागात तुमच्या टेक्निकल असेसमेंट ज्ञानावर आधारित 25 बहुपर्यायी प्रश्न असतील.
              प्रश्न तुमच्या निवडलेल्या विषयाशी संबंधित असतील.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-bold text-purple-400 mb-3">
              2. कम्युनिकेशन असेसमेंट (5 प्रश्न)
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              या विभागात तुमच्या संवाद कौशल्याची चाचणी घेतली जाईल.
              तुम्हाला दिलेल्या विषयावर बोलणे अपेक्षित आहे.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-bold text-blue-400 mb-3">
              3. सिच्युएशन असेसमेंट (10 प्रश्न)
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              निर्णयक्षमता आणि तर्कशक्ती तपासण्यासाठी सिच्युएशन-बेस्ड प्रश्न विचारले जातील.
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-2">
              महत्वाची सूचना
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              शांतपणे आणि लक्षपूर्वक उत्तरे द्या.
            </p>
          </div>
  <div className="mt-16 text-right">
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-4 rounded-xl font-semibold text-sm"
          >
            परीक्षा सुरू करा →
          </button>
        </div>
        </div>

        {/* Start Button */}
      

      </div>
    </div>
  );
}
