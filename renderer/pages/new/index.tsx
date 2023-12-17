import { AddFolder } from "../../components/AddFolder";

const New = () => {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 114px)"
      }}
      className="flex flex-col items-center justify-center"
    >
      <AddFolder />
    </div>
  );
};

export default New;
