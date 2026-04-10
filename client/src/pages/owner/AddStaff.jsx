import { useEffect, useState } from "react";
import API from "../../api/api";

const AddStaff = () => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        password: ""
    });

    const [staffList, setStaffList] = useState([]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        console.log("FORM DATA:", form); // 🔥 DEBUG

        if (!form.name || !form.phone || !form.password) {
            alert("All fields required");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");

            await API.post("/staff/create", form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Staff created");

            setForm({ name: "", phone: "", password: "" });

            fetchStaff();
        } catch (err) {
            console.log(err.response?.data);
            alert("Error creating staff");
        }
    };

    const fetchStaff = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const res = await API.get("/staff/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStaffList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div className="p-6">

            <h2>Add Staff</h2>

            <input
                name="name"
                value={form.name}
                placeholder="Name"
                onChange={handleChange}
            />

            <input
                name="phone"
                value={form.phone}
                placeholder="Phone"
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                value={form.password}
                placeholder="Password"
                onChange={handleChange}
            />

            <button onClick={handleSubmit}>
                Add Staff
            </button>

            <h3>Staff List</h3>

            {staffList.map((s) => (
                <div key={s._id}>
                    <p>{s.name}</p>
                    <p>{s.phone}</p>
                </div>
            ))}
        </div>
    );
};

export default AddStaff;