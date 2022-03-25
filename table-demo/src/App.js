import './App.css';
import {
  GraphQLReactTable,
  graphqlReactTableConfig,
} from 'tailwind-react-table';
import { CheckCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/solid';
import { useState } from 'react';
// import { Button } from 'tailwind-react-table';

function App() {
  const [notificationAll, setNotificationAll] = useState(notifications);

  const notificationTableConfig = {
    data: notificationAll,
    columns: [
      {
        Header: 'id',
        accessor: 'id',
      },
      {
        Header: 'site',
        accessor: 'site',
      },
      {
        Header: 'type',
        accessor: 'type',
      },
      {
        Header: 'status',
        accessor: 'status',
      },
      {
        Header: 'user',
        accessor: 'user',
      },
      {
        Header: 'when',
        accessor: 'when',
      },
    ],

    actions: [
      {
        actionName: 'View',
        icon: EyeIcon,
      },
      {
        actionName: 'Clear',
        icon: CheckCircleIcon,
      },
      {
        actionName: 'Snooze Until Later',
        icon: ClockIcon,
      },
    ],
  };

  return (
    <div style={{ padding: '30px' }}>
      <GraphQLReactTable graphqlReactTableConfig={notificationTableConfig} />
    </div>
  );
}

export default App;

const notifications = [
  {
    id: '1',
    site: 'The Edge Apartments',
    type: 'Maintenance request',
    status: 'new',
    user: 'John Doe',
    when: '23 min',
  },
  {
    id: '2',
    site: '111 Victoria Street',
    type: 'venue booking',
    status: 'cleared',
    user: 'Jane Atkinson',
    when: '5 days ago',
  },
  {
    id: '3',
    site: 'Esther Howard',
    type: 'Member',
    status: 'active',
    user: 'John Doe',
    when: '1 hour ago',
  },
  {
    id: '4',
    site: 'Esther Howard',
    type: 'Member',
    status: 'active',
    user: 'Central Security manager',
    when: '1 week ago',
  },
  {
    id: '5',
    site: 'Cameron Williamson',
    type: 'Member',
    status: 'active',
    user: 'Internal Applications Engineer',
    when: '7 month ago',
  },
  {
    id: '6',
    site: 'Kirsten Lee',
    type: 'Member',
    status: 'active',
    user: 'Central Security manager',
    when: '1 year ago',
  },
  {
    id: '7',
    site: 'Price Williams',
    type: 'Member',
    status: 'active',
    user: 'Central Security manager',
    when: '1 year ago',
  },
  {
    id: '8',
    site: 'Joe Smith',
    type: 'Member',
    status: 'active',
    user: 'Central Security manager',
    when: '1 year ago',
  },
];
