import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReactNotificationComponent = ({ title, body }) => {
    toast(<Display />,
        {
            autoClose: 50000, position: "top-right", hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    function Display() {
        return (
            <div onClick={() => console.log("ok")}>
                <h4>{title}</h4>
                <p>{body}</p>
            </div>
        );
    }
    return (
         <ToastContainer /> 
    );
};

export default ReactNotificationComponent;