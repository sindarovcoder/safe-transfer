const { getAllRegions } = require("./apis/address");
const { getAllPvz } = require("./apis/pvz");

const { keyboards, back } = require("./config/keyboards");

let regions = [];
async function getRegions(chatId) {
  if (!regions.length) {
    regions = await getAllRegions(chatId);
    regions.forEach((region) => {
      region.children = region.districts;
      region.children.forEach((district) => {
        district.children = district.villages;
      });
    });
  }
  return regions;
}

async function getPvzAddress(chatId) {
  let pvzCache = null;

  if (!pvzCache) {
    const pvzList = await getAllPvz(chatId);

    const regionMap = pvzList.reduce((regions, pvzItem) => {
      const {
        id,
        region,
        district,
        village,
        name,
        additionalInfo,
        postalCode,
        companyId,
      } = pvzItem;

      // Hududni yaratish yoki mavjudligini tekshirish
      if (!regions[region.id]) {
        regions[region.id] = { ...region, children: [] };
      }

      // Tumanni yaratish yoki mavjudligini tekshirish
      const regionChildren = regions[region.id].children;
      let districtExists = regionChildren.find((d) => d.id === district.id);

      if (!districtExists) {
        districtExists = { ...district, children: [] };
        regionChildren.push(districtExists);
      }

      // PVZni tuman ichiga qo'shish

      const villageName = village?.nameUz ? village?.nameUz : name;

      districtExists.children.push({
        id,
        districtId: district.id,
        nameUz: "🚩 " + villageName + " - " + name,
        nameOz: "🚩 " + villageName + " - " + name,
        nameRu: "🚩 " + villageName + " - " + name,
        additionalInfo,
        postalCode,
        companyId,
      });

      return regions;
    }, {});

    // Regionlarni massiv sifatida saqlaymiz
    pvzCache = Object.values(regionMap);
  }

  return pvzCache;
}

const registerSteps = [
  { field: "companyCode", prompt: "steps.register.companyCode" },
  { field: "offer", prompt: "steps.register.offer", replyKeyboards: ["auth.accept_offer", "auth.decline_offer"] },
  { field: "phoneNumber", prompt: "steps.register.phoneNumber" },
  { field: "verificationCode", prompt: "steps.register.verificationCode" },
  // { field: "password", prompt: "steps.register.password" },
  { field: "name", prompt: "steps.register.name" },
  // { field: "passportNo", prompt: "steps.register.passportNo" },
];

const addAddressSteps = [
  // { field: 'name', prompt: 'steps.addAddress.name' },
  // { field: 'phone', prompt: 'steps.addAddress.phone' },
  {
    field: "regionId",
    prompt: "steps.addAddress.regionId",
    addressKeyboards: true,
  },
  {
    field: "districtId",
    prompt: "steps.addAddress.districtId",
    addressKeyboards: true,
  },
  {
    field: "villageId",
    prompt: "steps.addAddress.villageId",
    addressKeyboards: true,
  },
  { field: "additionalInfo", prompt: "steps.addAddress.additionalInfo" },
];

const ourAddressSteps = [
  {
    field: "regionId",
    prompt: "steps.ourAddress.regionId",
    ourressKeyboards: true,
  },
  {
    field: "districtId",
    prompt: "steps.ourAddress.districtId",
    ourressKeyboards: true,
  },
  {
    field: "pvzId",
    prompt: "steps.ourAddress.pvzId",
    ourressKeyboards: true,
  },
];

const loginSteps = [
  { field: "username", prompt: "steps.login.username" },
  { field: "password", prompt: "steps.login.password" },
];

const simpleCreateOrderSteps = [
  { field: "trackingNumber", prompt: "steps.createOrder.trackingNumber" },
];

const CommentSteps = [
  {
    field: "comment",
    prompt: "steps.comment.newComment",
    // replyKeyboards: back,
    replyKeyboards: ["keyboard.BACK"],
  },
];

const CashPaySteps = [
  {
    field: "CashPay",
    prompt: "steps.CashPay.messeng",
    replyKeyboards: ["keyboard.BACK"],
    // replyKeyboards: [back()],
  },
];

const createOrderSteps = [
  { field: "trackingNumber", prompt: "steps.createOrder.trackingNumber" },
  {
    field: "packingType",
    prompt: "steps.createOrder.packingType",
    replyKeyboards: [
      "translate.packingType.ORIGINAL",
      "translate.packingType.UNPACKING",
    ],
  },
  {
    field: "isValuable",
    prompt: "steps.createOrder.isValuable",
    replyKeyboards: ["steps.yes", "steps.no"],
  },
  { field: "valuableNote", prompt: "steps.createOrder.valuableNote" },
];

const searchOrderSteps = [
  { field: "trackingNumber", prompt: "steps.myOrders.trackingNumber" },
];

const mergedTrackNumbers = [
  { field: "trackIds", prompt: "steps.myOrders.mergedTrackNumbers" },
];

const changePhoneSteps = [
  { field: "phoneNumber", prompt: "steps.changePhone.phoneNumber" },
  { field: "verificationCode", prompt: "steps.changePhone.verificationCode" },
];

const operationSteps = {
  REGISTER: registerSteps,
  ADD_ADDRESS: addAddressSteps,
  // LOGIN: loginSteps,
  SIMPLE_CREATE_ORDER: simpleCreateOrderSteps,
  CREATE_ORDER: createOrderSteps,
  SEARCH_ORDER: searchOrderSteps,
  COMMENT: CommentSteps,
  BANK_CARD_OR_CASH: CashPaySteps,
  OUR_ADDRESS: ourAddressSteps,
  MERGED_TRACK_NUMBERS: mergedTrackNumbers,
  CHANGE_PHONE: changePhoneSteps,
};

module.exports = {
  operationSteps,
  getRegions,
  getPvzAddress,
};
