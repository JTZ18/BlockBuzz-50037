import { useState, useEffect } from 'react';

function usePullToRefresh(onRefresh: any) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // could be more or less, depending on the device and sensitivity preferences
  const minPullDownDistance = 10;

  useEffect(() => {
    function handleTouchStart(e) {
      setTouchStart(e.targetTouches[0].clientY);
      setTouchEnd(null); // reset touchEnd to null
    }

    function handleTouchMove(e) {
      if (touchStart !== null) {
        setTouchEnd(e.targetTouches[0].clientY);
      }
    }

    function handleTouchEnd() {
      if (touchStart !== null && touchEnd !== null) {
        // Check if the pull down was enough to be considered a refresh
        if (touchStart - touchEnd > minPullDownDistance) {
          // Too sensitive or not enough, you can adjust minPullDownDistance
          onRefresh(); // Execute the refresh function passed from the component
        }
      }

      setTouchStart(null);
      setTouchEnd(null);
    }

    // Add the event listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Make sure to remove the event listeners when the component unmounts
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, minPullDownDistance, onRefresh]);
}

export default usePullToRefresh;
