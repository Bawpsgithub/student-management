import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import axios from 'axios';

import Input from '@/components/Input';
import MyModal from '@/components/Modal';
import Topbar from '@/components/Topbar';
import ClassTable from '@/components/class/classTable';

const Class = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedYearName, setSelectedYearName] = useState('');

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSemesterName, setSelectedSemesterName] = useState('');

  const [classGroups, setClassGroups] = useState([]);
  const [selectedClassGroup, setSelectedClassGroup] = useState('');
  const [selectedClassGroupName, setSelectedClassGroupName] = useState('');

  const [classes, setClasses] = useState([]);
  const [classData, setClassData] = useState({
    TenLop: '',
    SiSo: null,
    idKhoiLop: '',
    idHocKy: '',
  });

  const [yearData, setYearData] = useState({
    Namhoc: '',
  });

  const [toggleModal, setToggleModal] = useState(false);
  const [toggleYearModal, setToggleYearModal] = useState(false);
  let curr_year = new Date().getFullYear();

  // Fetch the list of available years
  const fetchYears = async () => {
    try {
      const response = await axios.get('/api/years');
      setYears(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    // Fetch the list of available semesters for the selected year
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(
          `/api/semesters?idNam=${selectedYear}`
        );
        setSemesters(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedYear) {
      fetchSemesters();
    }
  }, [selectedYear]);

  useEffect(() => {
    // Fetch the list of available class groups for the selected semester
    const fetchClassGroups = async () => {
      try {
        const response = await axios.get(`/api/class-groups`);
        setClassGroups(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedYear) {
      fetchClassGroups();
    }
  }, [selectedYear]);

  const fetchClasses = async () => {
    setClasses([]);

    try {
      const response = await axios.get(
        `/api/getClass?idHocKy=${selectedSemester}&idKhoiLop=${selectedClassGroup}`
      );
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch the available classes within the selected class group
    if (selectedClassGroup) {
      fetchClasses();
    }
  }, [selectedYear, selectedSemester, selectedClassGroup]);

  const addNewYear = async () => {
    const { Namhoc } = yearData;

    if (!Namhoc) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (Namhoc < curr_year || Namhoc > curr_year + 10) {
      alert('Năm học không hợp lệ');
      return;
    }

    try {
      const response = await axios.post('/api/addYear', {
        Namhoc: Namhoc,
      });
      console.log(response.data);
      alert('Thêm năm học thành công');
      fetchYears();
    } catch (error) {
      console.error('Error:', error);
      alert('Thêm năm học thất bại');
    }
  };

  const addNewClass = async () => {
    const { TenLop, SiSo, idKhoiLop, idHocKy } = classData;

    if (!TenLop || !idKhoiLop || !idHocKy) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(TenLop)) {
      alert('Tên lớp không được chứa ký tự đặc biệt');
      return;
    }

    const slicedClassName = TenLop.slice(0, 2);

    if (TenLop.length !== 4) {
      alert('Tên lớp phải có 4 ký tự');
      return;
    }

    if (!slicedClassName.includes(selectedClassGroupName)) {
      console.log(slicedClassName);
      console.log(selectedClassGroupName);
      alert('Tên lớp phải bắt đầu bằng tên khối lớp');
      return;
    }

    try {
      const response = await axios.post('/api/addClass', {
        TenLop: TenLop,
        SiSo: SiSo,
        idKhoiLop: idKhoiLop,
        idHocKy: idHocKy,
      });
      console.log(response.data);
      alert('Thêm lớp học thành công');
      fetchClasses();
      setToggleModal(false);
    } catch (error) {
      console.error('Error:', error.response.data);
      if (
        error.response.data ===
        'This class is already available now. Please try again.'
      ) {
        alert('Lớp học đã tồn tại');
      }
    }
  };

  // console.log('years:', years);
  // console.log('semesters:', semesters);
  // console.log('classGroups:', classGroups);

  // console.log('classData:', classData);
  // console.log('yearData:', yearData);

  // console.log('selectedYear', selectedYear);
  // console.log('selectedSemester', selectedSemester);
  // console.log('selectedClassGroup', selectedClassGroup);

  console.log('classes o FE:', typeof classes, classes);

  return (
    <>
      <Topbar NamePage="Bảng Điều Khiển Năm Học" />
      <div className="flex flex-col gap-10 px-20 pb-40 mt-10">
        {/* Modal for adding new class */}
        {toggleModal ? (
          <MyModal
            className="absolute "
            header={<p className="text-2xl font-bold">Thêm Lớp Học Mới</p>}
            body={
              <>
                <div className="flex justify-between w-full px-3 my-5">
                  <p className="text-lg font-semibold">
                    Năm Học: {selectedYearName}
                  </p>
                  <p className="text-lg font-semibold">
                    Học Kỳ: {selectedSemesterName}
                  </p>
                  <p className="text-lg font-semibold">
                    Khối Lớp: {selectedClassGroupName}
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  Tên Lớp <span className="text-red-500 text-xl">*</span>:{' '}
                </p>
                <Input
                  inputType="input"
                  placeholder="Tên Lớp"
                  handleClick={(e) =>
                    setClassData({ ...classData, TenLop: e.target.value })
                  }
                />
              </>
            }
            footer={
              <div className="flex justify-center w-full gap-10">
                <Button pill={false} onClick={() => addNewClass()}>
                  Chấp Nhận
                </Button>
                <Button
                  pill={false}
                  color="gray"
                  outline
                  onClick={() => setToggleModal(false)}
                >
                  Hủy
                </Button>
              </div>
            }
            handleClose={() => setToggleModal(false)}
            closeBtn={false}
          />
        ) : null}

        {/* Modal for adding new year */}
        {toggleYearModal ? (
          <MyModal
            className="absolute "
            header={<p className="text-2xl font-bold">Thêm Năm Học Mới</p>}
            body={
              <>
                <p className="text-lg font-semibold">
                  Năm Học Mới <span className="text-red-500 text-xl">*</span>:{' '}
                </p>
                <Input
                  inputType="number"
                  placeholder="Năm Học Mới"
                  handleClick={(e) =>
                    setYearData({ ...yearData, Namhoc: e.target.value })
                  }
                />
              </>
            }
            footer={
              <div className="flex justify-center w-full gap-10">
                <Button pill={false} onClick={() => addNewYear()}>
                  Chấp Nhận
                </Button>
                <Button
                  pill={false}
                  color="gray"
                  outline
                  onClick={() => setToggleYearModal(false)}
                >
                  Hủy
                </Button>
              </div>
            }
            handleClose={() => setToggleYearModal(false)}
            closeBtn={false}
          />
        ) : null}

        {/* List of classes */}
        <p className="text-3xl font-bold font-poppins">Bảng Điều Khiển</p>
        <div className="flex justify-between">
          {/* Filter of Year, Semester and ClassGroup */}
          <div className="flex items-center w-4/5 gap-5">
            <p className="text-lg font-semibold">Bộ Lọc:</p>

            <select
              className="px-2 py-1 border-2 border-gray-300 rounded-md"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                const selectedOptionData = years.find(
                  (option) => option.idNam === parseInt(e.target.value)
                );
                setSelectedYearName(selectedOptionData.Namhoc);
              }}
            >
              <option value="" disabled selected hidden>
                Chọn Năm Học
              </option>
              {years.map((year) => (
                <option key={year.idNam} value={year.idNam}>
                  {year.Namhoc}
                </option>
              ))}
            </select>

            {/* Add new year button */}
            {!selectedYear && (
              <Tooltip content="Thêm năm học">
                <Button
                  size="xs"
                  onClick={() => {
                    setToggleYearModal(true);
                  }}
                >
                  <HiPlus className="w-5 h-5" />
                </Button>
              </Tooltip>
            )}

            {selectedYear && (
              <select
                className="px-2 py-1 border-2 border-gray-300 rounded-md"
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setClassData({
                    ...classData,
                    idHocKy: e.target.value,
                  });
                  const selectedOptionData = semesters.find(
                    (option) => option.idHocKy === parseInt(e.target.value)
                  );
                  setSelectedSemesterName(selectedOptionData.HocKy);
                }}
              >
                <option value="" disabled selected hidden>
                  Chọn Học Kỳ
                </option>
                {semesters.map((semester) => (
                  <option key={semester.idHocKy} value={semester.idHocKy}>
                    {semester.HocKy}
                  </option>
                ))}
              </select>
            )}

            {selectedYear && (
              <select
                className="px-2 py-1 border-2 border-gray-300 rounded-md"
                value={selectedClassGroup}
                onChange={(e) => {
                  setSelectedClassGroup(e.target.value);
                  setClassData({
                    ...classData,
                    idKhoiLop: e.target.value,
                  });
                  const selectedOptionData = classGroups.find(
                    (option) => option.idKhoiLop === parseInt(e.target.value)
                  );
                  setSelectedClassGroupName(selectedOptionData.TenKhoiLop);
                }}
              >
                <option value="" disabled selected hidden>
                  Chọn Khối Lớp
                </option>
                {classGroups.map((classGroup) => (
                  <option
                    key={classGroup.idKhoiLop}
                    value={classGroup.idKhoiLop}
                  >
                    {classGroup.TenKhoiLop}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Add new class button */}
          <Button onClick={() => setToggleModal(true)}>
            Thêm Lớp Học Mới{' '}
          </Button>
        </div>

        {/* List of filtered classes */}
        <ClassTable classes={classes} />
      </div>
    </>
  );
};

export default Class;
