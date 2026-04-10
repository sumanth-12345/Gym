// // import { useEffect, useState } from "react";
// // import API from "../../api/api"; // your axios file

// // const OwnerProfile = () => {
// //     const [owner, setOwner] = useState(null);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const fetchOwner = async () => {
// //             try {
// //                 const token = sessionStorage.getItem("token");

// //                 const res = await API.get("/owner/me", {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`
// //                     }
// //                 });
// //                 console.log(res.data)

// //                 setOwner(res.data);
// //             } catch (err) {
// //                 console.log(err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchOwner();
// //     }, []);

// //     if (loading) {
// //         return <div className="p-6">Loading...</div>;
// //     }

// //     if (!owner) {
// //         return <div className="p-6 text-red-500">No data found</div>;
// //     }

// //     return (
// //         <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
// //             <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

// //                 {/* Header */}
// //                 <div className="flex items-center gap-4 border-b pb-4">
// //                     <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
// //                         {owner.name?.slice(0, 2).toUpperCase()}
// //                     </div>

// //                     <div>
// //                         <h2 className="text-lg font-semibold text-gray-800">
// //                             {owner.name}
// //                         </h2>
// //                         <p className="text-sm text-gray-500">{owner.email}</p>
// //                     </div>
// //                 </div>

// //                 {/* Details */}
// //                 <div className="mt-6 space-y-4">
// //                     <div>
// //                         <p className="text-sm text-gray-500">Phone</p>
// //                         <p className="font-medium text-gray-800">{owner.phone}</p>
// //                     </div>

// //                     <div>
// //                         <p className="text-sm text-gray-500">Owner ID</p>
// //                         <p className="font-medium text-gray-800">{owner.id}</p>
// //                     </div>
// //                 </div>

// //             </div>
// //         </div>
// //     );
// // };

// // export default OwnerProfile;

// import { useEffect, useState } from "react";
// import API from "../../api/api";

// const FEATURES = [
//     "memberAdd",
//     "memberList",
//     "payments",
//     "expiredMembers",
//     "activeMembers",
//     "trainerList"
// ];

// const OwnerProfile = () => {
//     const [staffList, setStaffList] = useState([]);
//     const [selectedStaff, setSelectedStaff] = useState(null);
//     const [accessType, setAccessType] = useState("limited");
//     const [features, setFeatures] = useState([]);

//     // 🔥 GET STAFF
//     const fetchStaff = async () => {
//         const token = sessionStorage.getItem("token");

//         const res = await API.get("/staff/all", {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         setStaffList(res.data);
//     };

//     useEffect(() => {
//         fetchStaff();
//     }, []);

//     // 🔥 CHECKBOX CHANGE
//     const handleFeatureChange = (f) => {
//         if (features.includes(f)) {
//             setFeatures(features.filter(x => x !== f));
//         } else {
//             setFeatures([...features, f]);
//         }
//     };

//     // 🔥 GIVE ACCESS
//     const giveAccess = async () => {
//         const token = sessionStorage.getItem("token");

//         await API.put(`/staff/permissions/${selectedStaff}`, {
//             access: accessType,
//             features
//         }, {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         alert("Access Updated");
//     };

//     // 🔥 REMOVE ACCESS
//     const removeAccess = async () => {
//         const token = sessionStorage.getItem("token");

//         await API.put(`/staff/permissions/${selectedStaff}`, {
//             access: "none",
//             features: []
//         }, {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         alert("Access Removed");
//     };

//     return (
//         <div className="p-6">

//             <h2 className="text-xl font-bold mb-4">Staff Access Control</h2>

//             {/* SELECT STAFF */}
//             <select
//                 onChange={(e) => setSelectedStaff(e.target.value)}
//                 className="border p-2 mb-4"
//             >
//                 <option>Select Staff</option>
//                 {staffList.map(s => (
//                     <option key={s._id} value={s._id}>
//                         {s.name}
//                     </option>
//                 ))}
//             </select>

//             {/* ACCESS TYPE */}
//             <div className="mb-4">
//                 <label>
//                     <input
//                         type="radio"
//                         value="full"
//                         checked={accessType === "full"}
//                         onChange={() => setAccessType("full")}
//                     />
//                     Full Access
//                 </label>

//                 <label className="ml-4">
//                     <input
//                         type="radio"
//                         value="limited"
//                         checked={accessType === "limited"}
//                         onChange={() => setAccessType("limited")}
//                     />
//                     Limited Access
//                 </label>
//             </div>

//             {/* FEATURES */}
//             {accessType === "limited" && (
//                 <div className="mb-4">
//                     {FEATURES.map(f => (
//                         <label key={f} className="block">
//                             <input
//                                 type="checkbox"
//                                 checked={features.includes(f)}
//                                 onChange={() => handleFeatureChange(f)}
//                             />
//                             {f}
//                         </label>
//                     ))}
//                 </div>
//             )}

//             {/* BUTTONS */}
//             <div className="space-x-3">
//                 <button
//                     onClick={giveAccess}
//                     className="bg-green-500 text-white px-4 py-2"
//                 >
//                     Give Access
//                 </button>

//                 <button
//                     onClick={removeAccess}
//                     className="bg-red-500 text-white px-4 py-2"
//                 >
//                     Remove Access
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default OwnerProfile;


import { useEffect, useState } from "react";
import API from "../../api/api";

const FEATURES = [
    { key: "memberAdd", label: "Add Member" },
    { key: "memberList", label: "Members List" },
    { key: "payments", label: "Payments" },
    { key: "expiredMembers", label: "Expiring Members" },
    { key: "activeMembers", label: "Active Members" },
    { key: "trainerList", label: "Trainer Details" }
];

const OwnerProfile = () => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [features, setFeatures] = useState([]);

    const fetchStaff = async () => {
        const token = sessionStorage.getItem("token");

        const res = await API.get("/staff/all", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setStaffList(res.data);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleFeatureChange = (key) => {
        if (features.includes(key)) {
            setFeatures(features.filter(f => f !== key));
        } else {
            setFeatures([...features, key]);
        }
    };

    const giveAccess = async () => {
        if (!selectedStaff) {
            alert("Select staff first");
            return;
        }

        const token = sessionStorage.getItem("token");

        await API.put(`/staff/permissions/${selectedStaff}`, {
            features
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Access Updated");
    };

    const removeAccess = async () => {
        if (!selectedStaff) {
            alert("Select staff first");
            return;
        }

        const token = sessionStorage.getItem("token");

        await API.put(`/staff/permissions/${selectedStaff}`, {
            features: []
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Access Removed");
    };

    return (
        <div className="p-6">

            <h2 className="text-xl font-bold mb-4">Staff Access Control</h2>

            {/* SELECT STAFF */}
            <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="border p-2 mb-4"
            >
                <option value="">Select Staff</option>
                {staffList.map(s => (
                    <option key={s._id} value={s._id}>
                        {s.name}
                    </option>
                ))}
            </select>

            {/* FEATURES */}
            <div className="mb-4">
                {FEATURES.map(f => (
                    <label key={f.key} className="block">
                        <input
                            type="checkbox"
                            checked={features.includes(f.key)}
                            onChange={() => handleFeatureChange(f.key)}
                        />
                        {f.label}
                    </label>
                ))}
            </div>

            {/* BUTTONS */}
            <div className="space-x-3">
                <button onClick={giveAccess} className="bg-green-500 text-white px-4 py-2">
                    Give Access
                </button>

                <button onClick={removeAccess} className="bg-red-500 text-white px-4 py-2">
                    Remove Access
                </button>
            </div>
        </div>
    );
};

export default OwnerProfile;