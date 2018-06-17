const vm = new Vue({
  el: '#travelPage',
  data: {
    travelInfos: [],
    locationSelected: '',
  },
  computed: {
    locationSelects() {
      const locationSelects = [];

      this.travelInfos.forEach((travelInfo) => {
        locationSelects.push(travelInfo.Zone);
      });

      const distinctLocationSelects = locationSelects.filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });

      return distinctLocationSelects;
    },
  },
  created() {
    const self = this;
    axios.get('https://data.kcg.gov.tw/api/action/datastore_search', {
      params: {
        resource_id: '92290ee5-6e61-456f-80c0-249eae2fcc97',
      },
    })
      .then(function (response) {
        self.travelInfos = response.data.result.records;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
});
