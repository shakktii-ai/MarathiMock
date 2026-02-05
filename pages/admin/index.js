import { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import User from '@/models/User';
import MockResult from '@/models/MockResult';
import ReportDetailPopup from '@/components/reportDetailPopup';
import mongoose from 'mongoose';
const Link = dynamic(() => import('next/link'), {
  ssr: false, // Optional: if you want to skip SSR for links (usually not recommended for SEO but fits "lazy")
});

export default function Index({ users }) {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("Admintoken");
    const adminString = localStorage.getItem("admin");

    if (!token || !adminString) {
      // Admin not logged in → redirect to login
      router.push("/admin/login");
    } else {
      try {
        const userFromStorage = JSON.parse(adminString);
        setUser({ ...userFromStorage, role: "admin" }); // add role for consistency
      } catch (err) {
        console.error("Failed to parse admin data:", err);
        localStorage.removeItem("Admintoken");
        localStorage.removeItem("admin");
        router.push("/admin/login");
      }
    }
  }, [router]);

  // useEffect(() => {

  //   if (!user?.collageName) return; // wait till user loads

  //   const collageName = user.collageName;
  //   // Example company name

  //   // const fetchActiveTests = async () => {
  //   //   const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive?collageName=${collageName}`, {
  //   //     method: 'GET',
  //   //     headers: { 'Content-Type': 'application/json' },
  //   //   });
  //   //   if (res.ok) {
  //   //     const data = await res.json();
  //   //     const collageData = data[0];
  //   //     if (collageData && collageData.isActive !== undefined) {
  //   //       return collageData.isActive;
  //   //     }
  //   //   }
  //   //   return 0; // Default value in case of error
  //   // };

  //   const fetchTotalUsers = async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/totalUsers?collageName=${collageName}`, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       if (data && data.totalUsers !== undefined) {
  //         return data.totalUsers;
  //       }
  //     }
  //     return 0; // Default value in case of error
  //   };

  //   const fetchCompletedTestReports = async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getReportByCollageName?collageName=${collageName}`, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       if (data && data.reports && Array.isArray(data.reports)) {
  //         return data.reports.length;
  //       }
  //     }
  //     return 0; // Default value in case of error
  //   };

  //   // Fetch all data concurrently
  //   const fetchData = async () => {
  //     try {
  //       const [activeTestsData, totalUsersData, completedTestData] = await Promise.all([
  //         fetchActiveTests(),
  //         fetchTotalUsers(),
  //         fetchCompletedTestReports(),
  //       ]);

  //       // Set the state once all data is fetched
  //       setActiveTests(activeTestsData);
  //       setTotalUsers(totalUsersData);
  //       setTotalCompleteTest(completedTestData);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setActiveTests(0);
  //       setTotalUsers(0);
  //       setTotalCompleteTest(0);
  //     }
  //   };

  //   fetchData();
  // }, [user]); // Added 'user' to dependency array to ensure effect runs when user state is set
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto mt-20">
        <header className="mb-6 md:mb-10 text-white drop-shadow-lg text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-base md:text-lg text-indigo-100 italic">Tracking performance for Mockmingle Students</p>
        </header>

        {/* Search and Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/90 backdrop-blur-sm border-none shadow-xl focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-4 h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 shadow-xl flex items-center justify-between text-white">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Students</p>
              <h3 className="text-3xl font-bold">{users.length}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/20 mb-10">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-indigo-50/50 border-b border-indigo-100">
                <tr>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-semibold text-indigo-900 uppercase tracking-wider">User Details</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-semibold text-indigo-900 uppercase tracking-wider text-center">Technical (MCQ)</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-semibold text-indigo-900 uppercase tracking-wider text-center">Communication</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-semibold text-indigo-900 uppercase tracking-wider text-center">Situation (MCQ)</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-xs md:text-sm font-semibold text-indigo-900 uppercase tracking-wider text-center">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsReportOpen(true);
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.fullName[0]}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{user.fullName}</div>
                            <div className="text-xs text-indigo-600 font-medium">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${user.techScore > 75 ? 'bg-green-100 text-green-700' : user.techScore > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {((user.techScore / 100) * 20).toFixed(0)}/20
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${user.commScore > 75 ? 'bg-green-100 text-green-700' : user.commScore > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {user.commScore}%
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${user.sitScore > 75 ? 'bg-green-100 text-green-700' : user.sitScore > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {((user.sitScore / 100) * 10).toFixed(0)}/10
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-black text-indigo-700">{user.overallScore}%</div>
                          <div className="w-16 h-1 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                              style={{ width: `${user.overallScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 font-medium italic">
                      No matching users found...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {isReportOpen && selectedUser && (
        <ReportDetailPopup
          user={selectedUser}
          isOpen={isReportOpen}
          setIsOpen={setIsReportOpen}
        />
      )}
    </main>
  );
}

export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  // Fetch users with @Mockmingle.com email
  const rawUsers = await User.find({
    email: { $regex: /@Mockmingle\.com$/i }
  }).lean();

  const usersWithScores = await Promise.all(rawUsers.map(async (user) => {
    // Fetch latest MockResult for each user
    const result = await MockResult.findOne({ email: user.email })
      .sort({ createdAt: -1 })
      .lean();

    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      techScore: result?.technicalAssessment?.percentage || 0,
      commScore: result?.voiceInterview?.percentage || 0,
      sitScore: result?.situationAssessment?.percentage || 0,
      overallScore: result?.aiReport?.overallScore || 0,
    };
  }));

  return {
    props: {
      users: JSON.parse(JSON.stringify(usersWithScores))
    }
  };
}
