interface AddressData {
  [city: string]: {
    [area: string]: string;
  };
}

interface ZoneOption {
  area: string;
  zip: string;
}

export function useAddressOption(
  AddressData: AddressData,
  RefModel: { [key: string]: any },
  RefKey: [string, string] = ["address", "zip"]
) {
  const cityOpt = ref<string[]>([]);
  const zoneOpt = ref<ZoneOption[]>([]);

  const InitAddressData = () => {
    if (AddressData) {
      cityOpt.value = [];
      zoneOpt.value = [];

      // 初始化 cityOpt
      for (const city of Object.keys(AddressData)) {
        cityOpt.value.push(city);
      }

      // 設定初始選擇的城市與地區
      RefModel[RefKey[0]] = cityOpt.value[0];
      updateZoneOpt();
    }
  };

  const updateZoneOpt = () => {
    zoneOpt.value = [];

    // 根據選擇的城市更新地區清單
    const selectedCity = RefModel[RefKey[0]];
    for (const [area, zip] of Object.entries(AddressData[selectedCity])) {
      zoneOpt.value.push({ area, zip });
    }

    // 設定初始的郵遞區號
    RefModel[RefKey[1]] = zoneOpt.value[0].zip;
  };

  // 初始化地址資料
  onMounted(() => {
    InitAddressData();
  });

  return {
    cityOpt,
    zoneOpt,
    updateZoneOpt,
  };
}
