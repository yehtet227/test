import React from 'react';
import OffshoreJP from './OffshoreJP';
import OffshoreMM from './OffshoreMM';

const RenderProjectComponent = ({ projectType, errMsg }) => {
  if (projectType === 'SES(Offshore)' || projectType === 'Offshore(Japan)') {
    return (
      <>
        <hr />
        <OffshoreJP errMsg={errMsg} />
      </>
    );
  } else if (projectType === 'Offshore(Myanmar)') {
    return (
      <>
        <hr />
        <OffshoreMM errMsg={errMsg} />
      </>
    );
  } else if (
    projectType === 'Offshore(Japan/Myanmar)' ||
    projectType === 'Offshore(Japan+Myanmar)'
  ) {
    return (
      <>
        <hr />
        <OffshoreJP errMsg={errMsg} />
        <hr />
        <OffshoreMM errMsg={errMsg} />
      </>
    );
  } else {
    return null;
  }
};

export default RenderProjectComponent;