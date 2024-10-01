import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmailState";
import { userLoggedInState } from "../store/selectors/userIsLoggedIn";
import { motion } from "framer-motion";

function LandingPage() {
  const navigate = useNavigate();
  const userEmail = useRecoilValue(userEmailState);
  const userLoading = useRecoilValue(userLoggedInState);

  return (
    <div className="p-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="mt-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <h1 className="text-4xl text-white font-bold">CourseHub User</h1>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <p className="text-white text-base mt-4">
              A place where you upskill yourself
            </p>
          </motion.div>
          {!userEmail && !userLoading && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex mt-6 space-x-4">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Sign Up
                </button>
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <div className="mt-5 md:mt-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: 80 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            {/* You can add an image or any additional content here if needed */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
