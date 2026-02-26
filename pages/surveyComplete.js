
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SurveyComplete() {
  const router = useRouter();

  useEffect(() => {
    const completeSurvey = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetch("/api/completeSurvey", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = JSON.parse(localStorage.getItem("user"));
        user.baselineSurveyCompleted = true;
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/");

      } catch (err) {
        console.error(err);
      }
    };

    completeSurvey();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">
        Processing... Please wait
      </p>
    </div>
  );
}