import React, { useState } from 'react';

const Prescription = () => {
    const [file, setFile] = useState(null);

    // Function to handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Get the selected file
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (file) {
            console.log("File submitted:", file);
            // Here you can add the logic to handle file upload, e.g., sending to server
        } else {
            alert("Please select a file before submitting.");
        }
    };

    return (
        <section className="pt-0 pb-20 md:pb-10 flex flex-col justify-center items-center bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip h-screen w-screen">
            {/* Title centered above the form */}
            <div className="mb-2">
                <h1 className="text-lg font-medium text-black">Add Prescription Data Privately</h1>
            </div>

            {/* Form container */}
            <div className="p-8 bg-blue-100 border-2 border-transparent rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-lg font-medium mb-4 text-blue-600 text-center">Upload Prescription</h1>

                <form onSubmit={handleSubmit}>
                    {/* File input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Prescription File:
                        </label>
                        <input 
                            type="file" 
                            accept=".pdf,.jpg,.png" 
                            onChange={handleFileChange}
                            className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md "
                    >
                        Give consent
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Prescription;
