import React, { useState } from 'react';

const Pharmacy = () => {
  // Sample data for the table
  const data = [
    {
      prescription: "Prescription #1",
      medicines: "Medicine A, Medicine B",
      pharmacyaccess: "Pharmacy x",
    },
    {
      prescription: "Prescription #2",
      medicines: "Medicine C, Medicine D",
      pharmacyaccess: "Pharmacy y",
    },
    {
      prescription: "Prescription #3",
      medicines: "Medicine E, Medicine F",
      pharmacyaccess: "Pharmacy z",
    },
  ];

  // State to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");

  // Function to handle opening the modal
  const openModal = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic for handling access (e.g., sending data to server)
    console.log("Access given to:", selectedPharmacy);
    closeModal(); // Close the modal after submission
  };

  return (
    <section className="pt-0 flex justify-center items-center flex-col pb-20 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip h-screen w-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-medium text-center text-black mb-6"> Access Management</h1>
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4">Prescription</th>
              <th className="py-3 px-4">Medicines</th>
              <th className="py-3 px-4">Pharmacy with Access</th>
              <th className="py-3 px-4">Give Access</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4 text-center">{item.prescription}</td>
                <td className="py-3 px-4 text-center">{item.medicines}</td>
                <td className="py-3 px-4 text-center">{item.pharmacyaccess}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => openModal(item.pharmacyaccess)}
                    className="bg-black text-sm text-white rounded px-4 py-2  transition"
                  >
                    Give Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Giving Access */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
              <h1 className="text-lg font-bold mb-4">Give Access to Pharmacy</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">

                  <input
                    type="text"
                    id="input-access"
                    placeholder="Enter pharmacy details"
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-black rounded px-4 py-2 mr-2 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white rounded px-4 py-2 hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pharmacy;
