
const FilterTab = () => {
  return (
    <div className=""
      style={{
        width: "229px",
        height: "432px",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 2px 8px 1px rgba(10, 10, 31, 0.1)",
        padding: "16px",
      }}
    >
      <div
        className="flex flex-col"
        style={{
          width: "197px",
          height: "20px",
          gap: "32px",
        }}
      >
        <h1
          style={{
            width: "77px",
            height: "14px",
            fontWeight: "500",
            fontSize: "20px",
            lineHeight: "23.48px",
            color: "#5A6566",
          }}
        >
          FILTERS
        </h1>
        <div
          className="flex"
          style={{
            width: "108px",
            height: "18px",
          }}
        >
          <input
            type="checkbox"
            style={{
              marginRight: "8px",
              width: "18px",
              height: "18px",
              gap: "10px",
              padding: "5px 15px 5px 15px",
              border: "1px",
              borderRadius: "4px",
              color: "#FFFFFF",
              borderColor: "#B6B6B6",
            }}
          />
          <p
            style={{
              width: "100px",
              height: "11px",
              fontWeight: "500",
              fontSize: "16px",
              lineHeight: "19.2px",
              color: "#525252",
            }}
          >
            Last Month
          </p>
        </div>
        <div
          className="flex"
          style={{
            width: "108px",
            height: "18px",
          }}
        >
          <input
            type="checkbox"
            style={{
              marginRight: "8px",
              width: "18px",
              height: "18px",
              gap: "10px",
              padding: "5px 15px 5px 15px",
              border: "1px",
              borderRadius: "4px",
              color: "#FFFFFF",
              borderColor: "#B6B6B6",
            }}
          />
          <p
            style={{
              width: "100px",
              height: "11px",
              fontWeight: "500",
              fontSize: "16px",
              lineHeight: "19.2px",
              color: "#525252",
            }}
          >
            Last Month
          </p>
        </div>
        <div
          className="flex align-items"
          style={{
            width: "108px",
            height: "18px",
          }}
        >
          <input
            type="checkbox"
            style={{
              marginRight: "8px",
              width: "18px",
              height: "18px",
              gap: "10px",
              padding: "5px 15px 5px 15px",
              border: "1px",
              borderRadius: "4px",
              color: "#FFFFFF",
              borderColor: "#B6B6B6",
            }}
          />
          <p
            style={{
              width: "100px",
              height: "11px",
              fontWeight: "500",
              fontSize: "16px",
              lineHeight: "19.2px",
              color: "#525252",
            }}
          >
            Last Month
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterTab;
