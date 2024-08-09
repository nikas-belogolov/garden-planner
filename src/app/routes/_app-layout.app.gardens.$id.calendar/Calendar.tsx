
import TUICalendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

export default function Calendar() {
    return (
      <div>
        <TUICalendar usageStatistics={false} />
      </div>
    );
  }