import Popup from 'reactjs-popup';
import SubjectControllerModal from './Modals/SubjectControllerModal';
import assets from '@/assets';
import Image from 'next/image';

export const subjectsColumns = [
  { Header: 'ID', accessor: 'index' },
  { Header: 'Tên Môn Học', accessor: 'TenMH' },
  { Header: 'Mô Tả', accessor: 'MoTa' },
  { Header: 'Hệ Số', accessor: 'HeSo' },
  {
    Header: 'Update',
    Cell: ({ row }) => (
      <Popup
        modal
        trigger={
          <div className="flex justify-center w-full">
            <Image src={assets.edit} width={20} height={20} />
          </div>
        }
      >
        {(close) => (
          <SubjectControllerModal
            close={close}
            idMH={row.original.idMH}
            TenMH={row.original.TenMH}
            MoTa={row.original.MoTa}
            HeSo={row.original.HeSo}
          />
        )}
      </Popup>
    ),
  },
];
