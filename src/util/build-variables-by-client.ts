type DatoraPayload = {
  now: Date;
  id: string;
  date: string;
  startTime: string;
  deployTime: number;
  testTime: number;
  rollbackTime: number;
  requester: string;
  systems: string;
  executorName: string;
  description: string;
};

type SurfPayload = {
  now: Date;
  id: string;
  date: string;
  startTime: string;
  deployTime: number;
  testTime: number;
  rollbackTime: number;
  systems: string;
  executorName: string;
  executorPhone: string;
  executorEmail: string;
  executorPosition: string;
  impact: string;
  title: string;
  description: string;
};

type Payload = {
  [key: string]: unknown;
};

const buildVariablesByClient = (payload: Payload, client: string) => {
  const buildDatoraVariables = (payload: DatoraPayload) => {
    const documentDate = formatDate(payload.now, 'dd/MM/yyyy');
    const [hours, minutes] = payload.startTime.split(':').map(Number);

    const deployStartTimeDateObject = parseDate(payload.date, 'dd/MM/yy');

    deployStartTimeDateObject.setHours(hours);
    deployStartTimeDateObject.setMinutes(minutes);

    const deployTestTimeDateObject = new Date(deployStartTimeDateObject);
    deployTestTimeDateObject.setMinutes(
      deployTestTimeDateObject.getMinutes() + payload.deployTime
    );

    const deployEndTimeDateObject = new Date(deployTestTimeDateObject);
    deployEndTimeDateObject.setMinutes(
      deployEndTimeDateObject.getMinutes() + payload.testTime
    );

    const rollbackTestTimeDateObject = new Date(deployEndTimeDateObject);
    rollbackTestTimeDateObject.setMinutes(
      rollbackTestTimeDateObject.getMinutes() + payload.rollbackTime
    );

    const rollbackEndTimeDateObject = new Date(rollbackTestTimeDateObject);
    rollbackEndTimeDateObject.setMinutes(
      rollbackEndTimeDateObject.getMinutes() + payload.testTime
    );

    const activityTimeInMInutes = `${
      payload.deployTime + payload.testTime
    } minutos`;
    const rollbackTimeInMinutes = `${
      payload.rollbackTime + payload.testTime
    } minutos`;

    const dateTimeMask = 'dd/MM/yy - HH:mm';

    const deployDateTime = formatDate(deployStartTimeDateObject, dateTimeMask);
    const deployTestDateTime = formatDate(
      deployTestTimeDateObject,
      dateTimeMask
    );
    const deployEndDateTime = formatDate(deployEndTimeDateObject, dateTimeMask);
    const rollbackDateTime = deployEndDateTime;
    const rollbackTesteDateTime = formatDate(
      rollbackTestTimeDateObject,
      dateTimeMask
    );
    const rollbackEndDateTime = formatDate(
      rollbackEndTimeDateObject,
      dateTimeMask
    );

    return {
      ...payload,
      documentDate,
      activityTimeInMInutes,
      rollbackTimeInMinutes,
      deployDateTime,
      deployTestDateTime,
      deployEndDateTime,
      rollbackDateTime,
      rollbackTesteDateTime,
      rollbackEndDateTime,
    };
  };

  const buildSurfVariables = (payload: SurfPayload) => {
    const documentDate = formatDate(payload.now, 'dd/MM/yyyy');
    const [hours, minutes] = payload.startTime.split(':').map(Number);
    const dateTimeMask = 'dd/MM/yy - HH:mm';

    const rawStartDateTime = parseDate(payload.date, 'dd/MM/yy');

    rawStartDateTime.setHours(hours);
    rawStartDateTime.setMinutes(minutes);

    const startDateTime = formatDate(rawStartDateTime, dateTimeMask);

    const activityTime = Math.floor(
      payload.deployTime + 2 * payload.testTime + payload.rollbackTime + 10
    );

    const rawEndDateTime = new Date(rawStartDateTime);
    rawEndDateTime.setMinutes(rawEndDateTime.getMinutes() + activityTime);

    const endDateTime = formatDate(rawEndDateTime, dateTimeMask);
    const gmudTime = `${activityTime} min`;

    const deployTime = `${Math.floor(payload.deployTime / 60)}:${
      payload.deployTime % 60
    }`.padStart(5, '0');
    const rollbackTime = `${Math.floor(payload.rollbackTime / 60)}:${
      payload.rollbackTime % 60
    }`.padStart(5, '0');
    const testTime = `${Math.floor(payload.testTime / 60)}:${
      payload.testTime % 60
    }`.padStart(5, '0');

    return {
      ...payload,
      documentDate,
      startDateTime,
      endDateTime,
      gmudTime,
      deployTime,
      rollbackTime,
      testTime,
    };
  };

  if (client === 'DATORA') {
    return buildDatoraVariables(<DatoraPayload>payload);
  }

  return buildSurfVariables(<SurfPayload>payload);
};
