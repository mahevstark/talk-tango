"use client";

import * as React from "react";
import Image from "next/image";

export default function Component({ image }) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const closeModal = (e) => {
        if (e.key === "Escape" || e.target.classList.contains("modal-overlay")) {
            setModalOpen(false);
        }
    };

    React.useEffect(() => {
        if (modalOpen) {
            document.addEventListener("keydown", closeModal);
        } else {
            document.removeEventListener("keydown", closeModal);
        }
        return () => document.removeEventListener("keydown", closeModal);
    }, [modalOpen]);

    return (
        <div>
            {/* Button to trigger the modal */}
            <div onClick={() => setModalOpen(true)}>
                <Image
                    src={image}
                    alt="Image"
                    width={100}
                    height={100}
                    className="rounded-md"
                    loading="lazy"
                />
            </div>

            {/* Modal content */}
            {modalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 modal-overlay "
                    onClick={closeModal}
                >

                    <Image
                        src={image}
                        width={300}
                        height={300}
                        loading="lazy"
                        alt="preview-image"
                    />

                </div>
            )}
        </div>
    );
}
