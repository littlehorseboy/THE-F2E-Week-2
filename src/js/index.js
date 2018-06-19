const vm = new Vue({
  el: '#travelPage',
  data: {
    travelInfos: [],
    // 篩選用
    filter_Name: '',
    locationSelected: '',
    fromDate: '',
    toDate: '',
    checkedNames: [],
    // 分頁功能用
    countOfPage: 5,
    currPage: 1,
    // detail 頁面
    showDetail: false,
    detail: {},
  },
  computed: {
    // TravelInfos 篩選結果
    filteredTravelInfos() {
      let filteredTravelInfos = this.travelInfos;
      // 關鍵字篩選
      if (this.filter_Name.trim() !== '') {
        filteredTravelInfos = filteredTravelInfos.filter((travelInfo) => {
          return travelInfo.Name.indexOf(this.filter_Name) > -1;
        });
      }
      // 地點篩選
      if (this.locationSelected.trim() !== '') {
        filteredTravelInfos = filteredTravelInfos.filter((travelInfo) => {
          return travelInfo.Zone.indexOf(this.locationSelected) > -1;
        });
      }
      // 日期篩選
      if (this.fromDate.trim() !== '') {
        filteredTravelInfos = filteredTravelInfos.filter((travelInfo) => {
          return travelInfo.Changetime > this.fromDate;
        });
      }
      // 日期篩選
      if (this.toDate.trim() !== '') {
        filteredTravelInfos = filteredTravelInfos.filter((travelInfo) => {
          return travelInfo.Changetime < this.toDate;
        });
      }
      // Category 篩選
      if (this.checkedNames.length > 0) {
        filteredTravelInfos = filteredTravelInfos.filter((travelInfo) => {
          let bool = false;
          this.checkedNames.forEach((checkName) => {
            if (travelInfo.Name.indexOf(checkName) > -1) {
              bool = true;
            }
          });
          return bool;
        });
      }

      return filteredTravelInfos;
    },

    // 分頁目前起始 index
    pageStart() {
      return (this.currPage - 1) * this.countOfPage;
    },
    // 分頁每一頁的數量
    totalPage() {
      return Math.ceil(this.filteredTravelInfos.length / this.countOfPage);
    },

    // 下拉選單內容建構
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
  methods: {
    // 點選切換分頁
    setPage(idx) {
      if (idx <= 0 || idx > this.totalPage) {
        return;
      }
      this.currPage = idx;
      window.scrollTo(0, 0);
    },
    // detail 頁面
    showDetailFunc(id) {
      if (id) {
        const index = vm.travelInfos.findIndex((travelInfo) => {
          return travelInfo.Id === id;
        });

        const sliceInfos = vm.travelInfos.slice(index, index + 1);
        sliceInfos.forEach((info) => {
          this.detail = info;
        });

        this.showDetail = true;
      } else {
        this.showDetail = false;
      }
    },
  },
  filters: {
    moment(value) {
      if (!value) return '';
      return moment(value).fromNow();
      // return moment(value).format('YYYY-MM-DD HH:mm:ss');
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
  mounted() {
    flatpickr('.flatpickr', {
      // enableTime: true,
      // allowInput: true,
      dateFormat: 'Y/m/d',
      // locale: 'zh',
    });
  },
});
