import React from 'react';

const Pharmacy = () => {
  // Sample data for the table
  const data = [
    {
      prescription: "Prescription #1",
      medicines: "Medicine A, Medicine B",
      pharmacyaccess:"Pharmacy x",

    },
    {
      prescription: "Prescription #2",
      medicines: "Medicine C, Medicine D",
      pharmacyaccess:"Pharmacy y",

    },
    {
      prescription: "Prescription #3",
      medicines: "Medicine E, Medicine F",
      pharmacyaccess:"Pharmacy z",

    },
  ];

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
              <th className="py-3 px-4">give Access</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4 text-center">{item.prescription}</td>
                <td className="py-3 px-4 text-center">{item.medicines}</td>
                <td className="py-3 px-4 text-center">{item.pharmacyaccess}</td>
                <td className="py-3 px-4 text-center">
                  <button className="bg-black text-sm text-white rounded px-4 py-2 hover:bg-blue-700 transition">
                   give Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Pharmacy;
