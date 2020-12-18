export const test = async url => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic Y2Fycmllcl90ZXN0OnRlc3RfY2Fycmllcg==',
        },
      });
      const data = await response.json();
      return console.log(data)
    } catch (error) {
      console.log("error", error);
    }
  };
  
  //
 
  