import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Create a base64 default thumbnail
const DEFAULT_THUMBNAIL = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDM0MCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjM0MCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMiLz4KICA8dGV4dCB4PSIxNzAiIHk9IjEwMCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxNnB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==`;

function CourseCard({ data }) {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    // Function to get valid thumbnail URL
    const getThumbnailUrl = () => {
        if (imgError || !data?.thumbnail) return DEFAULT_THUMBNAIL;

        if (data.thumbnail.secure_url) return data.thumbnail.secure_url;
        if (data.thumbnail.public_id) {
            // Construct Cloudinary URL if only public_id is available
            return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${data.thumbnail.public_id}`;
        }
        if (typeof data.thumbnail === 'string') return data.thumbnail;

        return DEFAULT_THUMBNAIL;
    };

    if (!data) return null;

    return (
        <div
            onClick={() => navigate("/course/description/", { state: { ...data } })}
            className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700 shadow-[0_0_10px_aqua]"
        >
            <div className="overflow-hidden">
                <img
                    className="h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale-110 transition-all ease-in-out duration-300 object-cover shadow-[0_0_10px_pink]"
                    src={getThumbnailUrl()}
                    alt={data?.title || "course thumbnail"}
                    onError={() => setImgError(true)}
                    loading="lazy"
                />

                <div className="p-3 space-y-1 text-white">
                    <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
                        {data?.title || "Untitled Course"}
                    </h2>
                    <p className="line-clamp-2">
                        {data?.description || "No description available"}
                    </p>
                    <p className="font-semibold">
                        <span className="text-yellow-500 font-bold">Category: </span>
                        {data?.category || "Uncategorized"}
                    </p>
                    <p className="font-semibold">
                        <span className="text-yellow-500 font-bold">Total lectures: </span>
                        {data?.numbersOfLectures || 0}
                    </p>
                    <p className="font-semibold">
                        <span className="text-yellow-500 font-bold">Instructor: </span>
                        {data?.createdBy || "Unknown"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;