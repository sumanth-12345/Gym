import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const TrainerList = () => {

    const [trainers, setTrainers] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    const fetchTrainers = async () => {
        const res = await API.get("/trainer/all");
        setTrainers(res.data);
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this trainer?")) return;

        await API.delete(`/trainer/delete/${id}`);
        fetchTrainers();
    };

    // EDIT CLICK
    const handleEditClick = (trainer) => {
        setEditId(trainer._id);
        setEditData(trainer);
    };

    // EDIT CHANGE
    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // UPDATE
    const handleUpdate = async () => {
        await API.put(`/trainer/update/${editId}`, editData);
        setEditId(null);
        fetchTrainers();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">Trainer List</h2>

                    <button
                        onClick={() => navigate("/owner/addtrainer")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        + Add Trainer
                    </button>
                </div>

                <table className="w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {trainers.map((t) => (
                            <tr key={t._id} className="text-center">

                                {/* EDIT MODE */}
                                {editId === t._id ? (
                                    <>
                                        <td className="border p-2">
                                            <input name="name" value={editData.name} onChange={handleEditChange} />
                                        </td>
                                        <td className="border p-2">
                                            <input name="phone" value={editData.phone} onChange={handleEditChange} />
                                        </td>
                                        <td className="border p-2">
                                            <input name="monthlyAmount" value={editData.monthlyAmount} onChange={handleEditChange} />
                                        </td>
                                        <td className="border p-2">
                                            <input type="date" name="joinDate" value={editData.joinDate?.substring(0, 10)} onChange={handleEditChange} />
                                        </td>
                                        <td className="border p-2 space-x-2">
                                            <button onClick={handleUpdate} className="bg-blue-500 text-white px-2 py-1 rounded">
                                                Save
                                            </button>
                                            <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border p-2">{t.name}</td>
                                        <td className="border p-2">{t.phone}</td>
                                        <td className="border p-2">₹{t.monthlyAmount}</td>
                                        <td className="border p-2">{new Date(t.joinDate).toLocaleDateString("en-GB")}</td>

                                        <td className="border p-2 space-x-2">
                                            <button
                                                onClick={() => handleEditClick(t)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrainerList;