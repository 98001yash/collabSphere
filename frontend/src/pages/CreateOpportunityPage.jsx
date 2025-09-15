import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createOpportunity, publishOpportunity } from "../api";
import { AuthContext } from "../contexts/AuthContext";

const CreateOpportunityPage = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "INTERNSHIP", // matches backend enum
    mode: "ONSITE",      // matches backend enum
    organization: "",
    stipendMin: "",
    stipendMax: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [createdOpportunity, setCreatedOpportunity] = useState(null);

  if (!["FACULTY", "ADMIN"].includes(user?.role)) {
    return <p className="text-red-500 text-center mt-10">❌ Access denied</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields and dates
      const payload = {
        ...form,
        stipendMin: form.stipendMin ? Number(form.stipendMin) : null,
        stipendMax: form.stipendMax ? Number(form.stipendMax) : null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        startDate: form.startDate ? form.startDate : null,
        endDate: form.endDate ? form.endDate : null,
        applicationDeadline: form.applicationDeadline
          ? new Date(form.applicationDeadline).toISOString()
          : null,
      };

      const res = await createOpportunity(payload, token);
      const opportunity = res.data.data; // backend returns data.data
      setCreatedOpportunity(opportunity);
      alert(`✅ Opportunity "${opportunity.title}" created successfully!`);
    } catch (err) {
      console.error("Error creating opportunity:", err);
      alert("❌ Failed to create opportunity");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!createdOpportunity) return;
    try {
      await publishOpportunity(createdOpportunity.id, token);
      alert(`🚀 Opportunity "${createdOpportunity.title}" published!`);
      navigate("/opportunities/manage");
    } catch (err) {
      console.error("Error publishing opportunity:", err);
      alert("❌ Failed to publish opportunity");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Create New Opportunity</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Title */}
        <div className="col-span-2">
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-2 font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="INTERNSHIP">Internship</option>
            <option value="EVENT">Event</option>
            <option value="HACKATHON">Hackathon</option>
            <option value="WORKSHOP">Workshop</option>
          </select>
        </div>

        {/* Mode */}
        <div>
          <label className="block mb-2 font-medium">Mode</label>
          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="ONSITE">Onsite</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        {/* Organization */}
        <div className="col-span-2">
          <label className="block mb-2 font-medium">Organization</label>
          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Stipend */}
        <div>
          <label className="block mb-2 font-medium">Stipend Min</label>
          <input
            type="number"
            name="stipendMin"
            value={form.stipendMin}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Stipend Max</label>
          <input
            type="number"
            name="stipendMax"
            value={form.stipendMax}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block mb-2 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-2 font-medium">Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-2 font-medium">Latitude</label>
          <input
            type="text"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Longitude</label>
          <input
            type="text"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Submit */}
        <div className="col-span-2 text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Create Opportunity"}
          </button>
        </div>
      </form>

      {/* Publish button for DRAFT */}
      {createdOpportunity && createdOpportunity.status === "DRAFT" && (
        <div className="mt-6 text-center">
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Publish Opportunity
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateOpportunityPage;
