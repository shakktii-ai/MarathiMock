import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminSurveys() {

    const router = useRouter();

    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");
        const adminStr = localStorage.getItem("admin");

        if (!token || !adminStr) {
            router.push("/admin/login");
            return;
        }

        fetchSurveys(token);

    }, []);

    const fetchSurveys = async (token) => {
        try {
            const res = await fetch("/api/admin/getSurveys", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!data.success) {
                router.push("/admin/login");
                return;
            }

            setSurveys(data.surveys);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ================= Pagination =================

    const totalPages = Math.ceil(surveys.length / rowsPerPage);

    const startIndex = (currentPage - 1) * rowsPerPage;

    const currentData = surveys.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg">
                Loading survey responses...
            </div>
        );
    }

    return (

        <main className="min-h-screen bg-gray-100 p-4 md:p-2 w-full">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-2">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Baseline Survey Responses
                    </h1>


                </div>

                {/* Table */}
                <div className="bg-white rounded-md shadow-xl border overflow-hidden">

                    {/* Scroll Wrapper */}
                    <div className="overflow-x-auto">

                        <table className="w-full text-left min-w-[1000px]">

                            <thead className="bg-gray-50 border-b text-sm">
                                <tr>
                                    <th className="px-1 py-1">Name</th>
                                    <th className="px-1 py-1">Age</th>
                                    <th className="px-1 py-3">Education</th>
                                    <th className="px-1 py-3">Working</th>
                                    <th className="px-1 py-3">Interview</th>
                                    <th className="px-1 py-3">Smartphone</th>
                                    <th className="px-1 py-3">Comfort</th>
                                    <th className="px-1 py-3">Language</th>

                                </tr>
                            </thead>

                            <tbody>

                                {currentData.map((item) => (

                                    <tr
                                        key={item._id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {item.name}
                                                </span>
                                                {item.email && (
                                                    <span className="text-xs text-gray-500">
                                                        {item.email}
                                                    </span>
                                                )}
                                                 <span className="text-xs text-gray-900">
                                                    {item.phone}
                                                </span>
                                            </div>
                                        </td>
                                        {/* <td className="px-1 py-2">{item.phone}</td> */}
                                        <td className="px-1 py-2">{item.age}</td>
                                        <td className="px-1 py-2">{item.education}</td>
                                        <td className="px-1 py-2">{item.working}</td>
                                        <td className="px-1 py-2">{item.interview}</td>
                                        <td className="px-1 py-2">{item.smartphone}</td>
                                        <td className="px-1 py-2">{item.comfort}</td>
                                        <td className="px-1 py-2">
                                            {item.language}
                                            {item.otherLanguage && ` (${item.otherLanguage})`}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap justify-between items-center p-4 border-t gap-3">

                        <div className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages || 1}
                        </div>

                        <div className="flex gap-2">

                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {[...Array(totalPages || 1)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded border ${currentPage === i + 1
                                            ? "bg-purple-600 text-white"
                                            : ""
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}