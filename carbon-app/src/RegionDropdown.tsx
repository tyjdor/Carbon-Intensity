import React, {
  ChangeEventHandler,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "./Context";
import "./RegionDropdown.css";

const RegionDropdown: FC<{
  onChange: ChangeEventHandler<HTMLSelectElement>;
}> = ({ onChange }) => {
  const { region, regionalData, setRegion } = useContext(Context);
  const [regionSelectList, setRegionSelectList] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (regionalData != null && regionalData.data[0] != null) {
      setRegionSelectList(
        regionalData.data[0].regions.map((r: any) => ({
          id: r.regionid,
          name: r.shortname,
        }))
      );
    }
  }, [regionalData]);
  const changeWrapper = (ev: any) => {
    let id = +ev.target.value;
    setRegion(
      regionalData.data[0].regions.find(
        (element: any) => element.regionid === id
      )
    );
    onChange(ev);
  };
  return (
    <>
      <label className="select">
        <select onChange={changeWrapper}>
          <option value="">Choose Region</option>
          {regionSelectList?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
};

export default RegionDropdown;
