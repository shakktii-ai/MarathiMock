// import { useEffect } from "react";
// import { useRouter } from "next/router";

// export default function BaselineSurvey() {
//   const router = useRouter();

//   // Optional: protect page if user not logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/login");
//     }
//   }, []);

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">

//       {/* Header */}
//       <div className="bg-white shadow p-4 text-center font-semibold text-lg">
//         Baseline Survey (Mandatory)
//         <p className="text-sm text-gray-500">
//           Please complete this survey before accessing your dashboard.
//         </p>
//       </div>

//       {/* Google Form */}
//       <div className="flex-1">
//         <iframe
//           src="https://docs.google.com/forms/d/e/1FAIpQLSczhGUScK10PGDe_8PD7Du4mSJYd6RiH-h_hJOb9-wq29U-Hw/viewform?embedded=true"
//           className="w-full h-full border-0"
//         />
//       </div>

//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
  const Card = ({ children }) => (
    <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
      {children}
    </div>
  );

  const Radio = ({ name, value, label, onChange }) => (
    <label className="flex items-start gap-3 cursor-pointer py-1">
      <input
        type="radio"
        name={name}
        className="mt-1 accent-purple-600"
        onChange={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  );
export default function BaselineSurvey() {

  const router = useRouter();

  const [form, setForm] = useState({
    email:"",
    name: "",
    phone: "",
    age: "",
    education: "",
    interview: "",
    working: "",
    smartphone: "",
    comfort: "",
    language: "",
    otherLanguage: "",
  });

  const [loading, setLoading] = useState(false);

  // auto fill from user if exists
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      setLoading(true);

      const res = await fetch("/api/completeSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      user.baselineSurveyCompleted = true;
      localStorage.setItem("user", JSON.stringify(user));

      alert("Survey submitted successfully.");

      router.push("/");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#f0ebf8] py-6 px-3 md:px-6">

      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="bg-white rounded-xl shadow border-t-8 border-purple-600 p-6">
          <h1 className="text-xl md:text-2xl font-semibold">
            MockMingle x Y4D – Baseline Survey
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            * Indicates required question
          </p>
        </div>
<Card>
          <label className="font-medium">
            Email / ईमेल <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border-b mt-3 p-2 outline-none focus:border-purple-600"
            placeholder="Your answer"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Card>
        {/* Name */}
        <Card>
          <label className="font-medium">
            Name / नाव / नाम <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border-b mt-3 p-2 outline-none focus:border-purple-600"
            placeholder="Your answer"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Card>

        {/* Phone */}
        <Card>
          <label className="font-medium">
            Phone Number / फोन नंबर <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border-b mt-3 p-2 outline-none focus:border-purple-600"
            placeholder="Your answer"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Card>

        {/* Age */}
        <Card>
          <label className="font-medium">
            Age / वय / आयु <span className="text-red-500">*</span>
          </label>

          <div className="mt-3 space-y-1">
            {["18-21", "22-25", "26-30", "31+"].map((item) => (
              <Radio
                key={item}
                name="age"
                value={item}
                label={item}
                onChange={(v) => handleChange("age", v)}
              />
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card>
          <label className="font-medium">
            Education Level / शिक्षण पातळी / शिक्षा का स्तर{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="mt-3 space-y-1">
            <Radio
              name="education"
              value="10th"
              label="10th"
              onChange={(v) => handleChange("education", v)}
            />

            <Radio
              name="education"
              value="12th"
              label="12th"
              onChange={(v) => handleChange("education", v)}
            />

            <Radio
              name="education"
              value="Graduate"
              label="Graduate / पदवीधर / स्नातक"
              onChange={(v) => handleChange("education", v)}
            />

            <Radio
              name="education"
              value="Post Graduate"
              label="Post Graduate / पदव्युत्तर / पदवत्तर्यु"
              onChange={(v) => handleChange("education", v)}
            />
          </div>
        </Card>

        {/* Interview */}
        <Card>
          <label className="font-medium">
            Have you ever done a formal job interview? /
            तुम्ही कधी औपचारिक नोकरीची मुलाखत घेतली आहे का? / क्या आपने कभी औपचारिक नौकरी का इंटरव्यू दिया है?
            <span className="text-red-500">*</span>
          </label>

          <div className="mt-3">
            <Radio
              name="interview"
              value="Yes"
              label="Yes / होय / हां"
              onChange={(v) => handleChange("interview", v)}
            />

            <Radio
              name="interview"
              value="No"
              label="No / नाही / नहीं"
              onChange={(v) => handleChange("interview", v)}
            />
          </div>
        </Card>

        {/* Working */}
        <Card>
          <label className="font-medium">
            Are you currently working? /
            तुम्ही सध्या काम करत आहात का? /
            क्या आप इस समय कार्यरत हैं?
            <span className="text-red-500">*</span>
          </label>

          <div className="mt-3">
            <Radio
              name="working"
              value="Yes"
              label="Yes / होय / हां"
              onChange={(v) => handleChange("working", v)}
            />

            <Radio
              name="working"
              value="No"
              label="No / नाही / नहीं"
              onChange={(v) => handleChange("working", v)}
            />
          </div>
        </Card>

        {/* Smartphone */}
        <Card>
          <label className="font-medium">
            Do you have a smartphone you can use daily? /
            तुमच्याकडे दररोज वापरता येईल असा स्मार्टफोन आहे का? /
            क्या आपके पास स्मार्टफोन है जिसका आप रोजाना उपयोग कर सकते हैं?
            <span className="text-red-500">*</span>
          </label>

          <div className="mt-3">
            <Radio
              name="smartphone"
              value="Yes"
              label="Yes / होय / हां"
              onChange={(v) => handleChange("smartphone", v)}
            />

            <Radio
              name="smartphone"
              value="No"
              label="No / नाही / नहीं"
              onChange={(v) => handleChange("smartphone", v)}
            />
          </div>
        </Card>

        {/* Comfort Scale */}
        <Card>
          <label className="font-medium">
            How comfortable are you using apps or mobile forms? /
            तुम्ही अ‍ॅप्स किंवा मोबाइल फॉर्म वापरण्यात किती सोयीस्कर आहात? /
            आप अ‍ॅप्स या मोबाइल फॉर्म का उपयोग करने में कितने सहज हैं?
            <span className="text-red-500">*</span>
          </label>

          <div className="flex justify-between mt-5 text-sm md:text-base">
            <span className="text-gray-500">
              Not Comfortable / अजिबात कम्फर्टेबल नाही /  बिल्कुल भी आरामदायक नहीं / 
            </span>

            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center">
                  <span>{num}</span>
                  <input
                    type="radio"
                    name="comfort"
                    className="accent-purple-600"
                    checked={form.comfort === num}
                    onChange={() => handleChange("comfort", num)}
                  />
                </label>
              ))}
            </div>

            <span className="text-gray-500">
              Very Comfortable / खूप आरामदायी / बहुत ही आरामदायक
            </span>
          </div>
        </Card>

        {/* Language */}
        <Card>
          <label className="font-medium">
            Which language are you most comfortable with? /
            तुम्हाला कोणती भाषा सर्वात जास्त सोयीस्कर वाटते? /
            आप किस भाषा में सबसे अधिक सहज हैं?
            <span className="text-red-500">*</span>
          </label>

          <div className="mt-3 space-y-1">
            <Radio
              name="language"
              value="Hindi"
              label="Hindi / हिंदी"
              onChange={(v) => handleChange("language", v)}
            />

            <Radio
              name="language"
              value="Marathi"
              label="Marathi / मराठी"
              onChange={(v) => handleChange("language", v)}
            />

            <Radio
              name="language"
              value="English"
              label="English / इंग्रजी"
              onChange={(v) => handleChange("language", v)}
            />

            <label className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                name="language"
                className="accent-purple-600"
                checked={form.language === "Other"}
                onChange={() => handleChange("language", "Other")}
              />
              Other:
              <input
                className="border-b outline-none ml-2"
                value={form.otherLanguage}
                onChange={(e) =>
                  handleChange("otherLanguage", e.target.value)
                }
              />
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="text-center pt-2 pb-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400
                       text-white px-10 py-3 rounded-lg shadow font-medium w-full md:w-auto"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}