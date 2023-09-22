'use client';

import { useEffect, useState } from 'react';

const Client = () => {
  const [cont2, setCont2] = useState('');
  useEffect(() => {
    fetch('/api/hw')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        setCont2(res);
      });
  }, []);
  return (
    <div>
      <p>{cont2}</p>
    </div>
  );
};

export default Client;
