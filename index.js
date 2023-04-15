"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ** React Imports
var react_1 = require("react");
// ** Store & Actions Imports
var peerjs_1 = __importDefault(require("peerjs"));
// import { useRouter } from "next/router";
var axios_1 = __importDefault(require("axios"));
var socket_io_client_1 = require("socket.io-client");
var moment_1 = __importDefault(require("moment"));
var Rtc = function (_a) {
    var _b = _a.chatRoomId, chatRoomId = _b === void 0 ? "testChatroom" : _b, dealerYn = _a.dealerYn, _c = _a.config, SOCKET_URI = _c.SOCKET_URI, SOCKET_NAMESPACE = _c.SOCKET_NAMESPACE, WEBRTC_URI = _c.WEBRTC_URI, WEBRTC_SLAVE_URI = _c.WEBRTC_SLAVE_URI, WEBRTC_PORT = _c.WEBRTC_PORT, WEBRTC_ROOM_URI = _c.WEBRTC_ROOM_URI, WEBRTC_PATH = _c.WEBRTC_PATH;
    var SERVER_URI = WEBRTC_URI;
    var SERVER_SLAVE_URI = WEBRTC_SLAVE_URI;
    var SERVER_PORT = parseInt(WEBRTC_PORT);
    var _d = (0, react_1.useState)(true), cameraOnYn = _d[0], setCameraOnYn = _d[1];
    var _e = (0, react_1.useState)(true), micOnYn = _e[0], setMicOnYn = _e[1];
    var _f = (0, react_1.useState)(0), cardOpenedIndex = _f[0], setCardOpenedIndex = _f[1];
    var _g = (0, react_1.useState)(false), screenSharingYn = _g[0], setScreenSharingYn = _g[1];
    var _h = (0, react_1.useState)(), localStream = _h[0], setLocalStream = _h[1];
    var _j = (0, react_1.useState)(), remoteStream = _j[0], setRemoteStream = _j[1];
    var _k = (0, react_1.useState)(), peerId = _k[0], setPeerId = _k[1];
    var _l = (0, react_1.useState)(), destination = _l[0], setDestination = _l[1];
    var _m = (0, react_1.useState)(), mediaConnection = _m[0], setMediaConnection = _m[1];
    var _o = (0, react_1.useState)(false), finding = _o[0], setFinding = _o[1];
    var _p = (0, react_1.useState)(false), connected = _p[0], setConnected = _p[1];
    var _q = (0, react_1.useState)(false), connecting = _q[0], setConnecting = _q[1];
    var _r = (0, react_1.useState)(), local = _r[0], setLocal = _r[1];
    var _s = (0, react_1.useState)(), mediaDevices = _s[0], setMediaDevices = _s[1];
    var _t = (0, react_1.useState)(), peerErrorMessage = _t[0], setPeerErrorMessage = _t[1];
    var _u = (0, react_1.useState)(), streamCameraErrored = _u[0], setStreamCameraErrored = _u[1];
    var _v = (0, react_1.useState)(), streamMicErrored = _v[0], setStreamMicErrored = _v[1];
    var _w = (0, react_1.useState)(false), networkErrored = _w[0], setNetworkErrored = _w[1];
    var _x = (0, react_1.useState)(navigator.onLine), networkOnline = _x[0], setNetworkOnline = _x[1];
    // modal errored
    var _y = (0, react_1.useState)(), peerModalErrorMessage = _y[0], setPeerModalErrorMessage = _y[1];
    var _z = (0, react_1.useState)(true), customerMicOnYn = _z[0], setCustomerMicOnYn = _z[1];
    var _0 = (0, react_1.useState)(true), customerCameraOnYn = _0[0], setCustomerCameraOnYn = _0[1];
    var _1 = (0, react_1.useState)(false), customerLeftYn = _1[0], setCustomerLeftYn = _1[1];
    var _2 = (0, react_1.useState)(), socketInstance = _2[0], setSocketInstance = _2[1];
    var _3 = (0, react_1.useState)(false), leftYn = _3[0], setLeftYn = _3[1];
    var _4 = (0, react_1.useState)(), startTime = _4[0], setStartTime = _4[1];
    var _5 = (0, react_1.useState)(0), timeDiff = _5[0], setTimeDiff = _5[1];
    var userType = dealerYn ? "DEALER" : "CUSTOMER";
    var playerRef = (0, react_1.useRef)();
    var remotePlayerRef = (0, react_1.useRef)();
    var peerMaster = {
        host: SERVER_URI,
        path: WEBRTC_PATH,
        port: SERVER_PORT,
        secure: true,
        debug: process.env.NEXT_PUBLIC_ENV_NODE_ENV === "development" ? 3 : 1,
        config: {
            iceServers: [
                { urls: ["stun:stun01.sipphone.com"] },
                { urls: ["stun:stun.ekiga.net"] },
                { urls: ["stun:stunserver.org"] },
                { urls: ["stun:stun.softjoys.com"] },
                { urls: ["stun:stun.voiparound.com"] },
                { urls: ["stun:stun.voipbuster.com"] },
                { urls: ["stun:stun.voipstunt.com"] },
                { urls: ["stun:stun.voxgratia.org"] },
                { urls: ["stun:stun.xten.com"] },
                { urls: ["stun:stun.1und1.de:3478"] },
                { urls: ["stun:stun.2talk.co.nz:3478"] },
                { urls: ["stun:stun.2talk.com:3478"] },
                { urls: ["stun:stun.3clogic.com:3478"] },
                { urls: ["stun:stun.3cx.com:3478"] },
                { urls: ["stun:stun.a-mm.tv:3478"] },
                { urls: ["stun:stun.aa.net.uk:3478"] },
                { urls: ["stun:stun.acrobits.cz:3478"] },
                { urls: ["stun:stun.actionvoip.com:3478"] },
                { urls: ["stun:stun.advfn.com:3478"] },
                { urls: ["stun:stun.aeta-audio.com:3478"] },
                { urls: ["stun:stun.aeta.com:3478"] },
                { urls: ["stun:stun.alltel.com.au:3478"] },
                { urls: ["stun:stun.altar.com.pl:3478"] },
                { urls: ["stun:stun.annatel.net:3478"] },
                { urls: ["stun:stun.antisip.com:3478"] },
                { urls: ["stun:stun.arbuz.ru:3478"] },
                { urls: ["stun:stun.avigora.com:3478"] },
                { urls: ["stun:stun.avigora.fr:3478"] },
                { urls: ["stun:stun.awa-shima.com:3478"] },
                { urls: ["stun:stun.awt.be:3478"] },
                { urls: ["stun:stun.b2b2c.ca:3478"] },
                { urls: ["stun:stun.bahnhof.net:3478"] },
                { urls: ["stun:stun.barracuda.com:3478"] },
                { urls: ["stun:stun.bluesip.net:3478"] },
                { urls: ["stun:stun.bmwgs.cz:3478"] },
                { urls: ["stun:stun.botonakis.com:3478"] },
                { urls: ["stun:stun.budgetphone.nl:3478"] },
                { urls: ["stun:stun.budgetsip.com:3478"] },
                { urls: ["stun:stun.cablenet-as.net:3478"] },
                { urls: ["stun:stun.callromania.ro:3478"] },
                { urls: ["stun:stun.callwithus.com:3478"] },
                { urls: ["stun:stun.cbsys.net:3478"] },
                { urls: ["stun:stun.chathelp.ru:3478"] },
                { urls: ["stun:stun.cheapvoip.com:3478"] },
                { urls: ["stun:stun.ciktel.com:3478"] },
                { urls: ["stun:stun.cloopen.com:3478"] },
                { urls: ["stun:stun.colouredlines.com.au:3478"] },
                { urls: ["stun:stun.comfi.com:3478"] },
                { urls: ["stun:stun.commpeak.com:3478"] },
                { urls: ["stun:stun.comtube.com:3478"] },
                { urls: ["stun:stun.comtube.ru:3478"] },
                { urls: ["stun:stun.cope.es:3478"] },
                { urls: ["stun:stun.counterpath.com:3478"] },
                { urls: ["stun:stun.counterpath.net:3478"] },
                { urls: ["stun:stun.cryptonit.net:3478"] },
                { urls: ["stun:stun.darioflaccovio.it:3478"] },
                { urls: ["stun:stun.datamanagement.it:3478"] },
                { urls: ["stun:stun.dcalling.de:3478"] },
                { urls: ["stun:stun.decanet.fr:3478"] },
                { urls: ["stun:stun.demos.ru:3478"] },
                { urls: ["stun:stun.develz.org:3478"] },
                { urls: ["stun:stun.dingaling.ca:3478"] },
                { urls: ["stun:stun.doublerobotics.com:3478"] },
                { urls: ["stun:stun.drogon.net:3478"] },
                { urls: ["stun:stun.duocom.es:3478"] },
                { urls: ["stun:stun.dus.net:3478"] },
                { urls: ["stun:stun.e-fon.ch:3478"] },
                { urls: ["stun:stun.easybell.de:3478"] },
                { urls: ["stun:stun.easycall.pl:3478"] },
                { urls: ["stun:stun.easyvoip.com:3478"] },
                { urls: ["stun:stun.efficace-factory.com:3478"] },
                { urls: ["stun:stun.einsundeins.com:3478"] },
                { urls: ["stun:stun.einsundeins.de:3478"] },
                { urls: ["stun:stun.ekiga.net:3478"] },
                { urls: ["stun:stun.epygi.com:3478"] },
                { urls: ["stun:stun.etoilediese.fr:3478"] },
                { urls: ["stun:stun.eyeball.com:3478"] },
                { urls: ["stun:stun.faktortel.com.au:3478"] },
                { urls: ["stun:stun.freecall.com:3478"] },
                { urls: ["stun:stun.freeswitch.org:3478"] },
                { urls: ["stun:stun.freevoipdeal.com:3478"] },
                { urls: ["stun:stun.fuzemeeting.com:3478"] },
                { urls: ["stun:stun.gmx.de:3478"] },
                { urls: ["stun:stun.gmx.net:3478"] },
                { urls: ["stun:stun.gradwell.com:3478"] },
                { urls: ["stun:stun.halonet.pl:3478"] },
                { urls: ["stun:stun.hellonanu.com:3478"] },
                { urls: ["stun:stun.hoiio.com:3478"] },
                { urls: ["stun:stun.hosteurope.de:3478"] },
                { urls: ["stun:stun.ideasip.com:3478"] },
                { urls: ["stun:stun.imesh.com:3478"] },
                { urls: ["stun:stun.infra.net:3478"] },
                { urls: ["stun:stun.internetcalls.com:3478"] },
                { urls: ["stun:stun.intervoip.com:3478"] },
                { urls: ["stun:stun.ipcomms.net:3478"] },
                { urls: ["stun:stun.ipfire.org:3478"] },
                { urls: ["stun:stun.ippi.fr:3478"] },
                { urls: ["stun:stun.ipshka.com:3478"] },
                { urls: ["stun:stun.iptel.org:3478"] },
                { urls: ["stun:stun.irian.at:3478"] },
                { urls: ["stun:stun.it1.hr:3478"] },
                { urls: ["stun:stun.ivao.aero:3478"] },
                { urls: ["stun:stun.jappix.com:3478"] },
                { urls: ["stun:stun.jumblo.com:3478"] },
                { urls: ["stun:stun.justvoip.com:3478"] },
                { urls: ["stun:stun.kanet.ru:3478"] },
                { urls: ["stun:stun.kiwilink.co.nz:3478"] },
                { urls: ["stun:stun.kundenserver.de:3478"] },
                { urls: ["stun:stun.l.google.com:19302"] },
                { urls: ["stun:stun.linea7.net:3478"] },
                { urls: ["stun:stun.linphone.org:3478"] },
                { urls: ["stun:stun.liveo.fr:3478"] },
                { urls: ["stun:stun.lowratevoip.com:3478"] },
                { urls: ["stun:stun.lugosoft.com:3478"] },
                { urls: ["stun:stun.lundimatin.fr:3478"] },
                { urls: ["stun:stun.magnet.ie:3478"] },
                { urls: ["stun:stun.manle.com:3478"] },
                { urls: ["stun:stun.mgn.ru:3478"] },
                { urls: ["stun:stun.mit.de:3478"] },
                { urls: ["stun:stun.mitake.com.tw:3478"] },
                { urls: ["stun:stun.miwifi.com:3478"] },
                { urls: ["stun:stun.modulus.gr:3478"] },
                { urls: ["stun:stun.mozcom.com:3478"] },
                { urls: ["stun:stun.myvoiptraffic.com:3478"] },
                { urls: ["stun:stun.mywatson.it:3478"] },
                { urls: ["stun:stun.nas.net:3478"] },
                { urls: ["stun:stun.neotel.co.za:3478"] },
                { urls: ["stun:stun.netappel.com:3478"] },
                { urls: ["stun:stun.netappel.fr:3478"] },
                { urls: ["stun:stun.netgsm.com.tr:3478"] },
                { urls: ["stun:stun.nfon.net:3478"] },
                { urls: ["stun:stun.noblogs.org:3478"] },
                { urls: ["stun:stun.noc.ams-ix.net:3478"] },
                { urls: ["stun:stun.node4.co.uk:3478"] },
                { urls: ["stun:stun.nonoh.net:3478"] },
                { urls: ["stun:stun.nottingham.ac.uk:3478"] },
                { urls: ["stun:stun.nova.is:3478"] },
                { urls: ["stun:stun.nventure.com:3478"] },
                { urls: ["stun:stun.on.net.mk:3478"] },
                { urls: ["stun:stun.ooma.com:3478"] },
                { urls: ["stun:stun.ooonet.ru:3478"] },
                { urls: ["stun:stun.oriontelekom.rs:3478"] },
                { urls: ["stun:stun.outland-net.de:3478"] },
                { urls: ["stun:stun.ozekiphone.com:3478"] },
                { urls: ["stun:stun.patlive.com:3478"] },
                { urls: ["stun:stun.personal-voip.de:3478"] },
                { urls: ["stun:stun.petcube.com:3478"] },
                { urls: ["stun:stun.phone.com:3478"] },
                { urls: ["stun:stun.phoneserve.com:3478"] },
                { urls: ["stun:stun.pjsip.org:3478"] },
                { urls: ["stun:stun.poivy.com:3478"] },
                { urls: ["stun:stun.powerpbx.org:3478"] },
                { urls: ["stun:stun.powervoip.com:3478"] },
                { urls: ["stun:stun.ppdi.com:3478"] },
                { urls: ["stun:stun.prizee.com:3478"] },
                { urls: ["stun:stun.qq.com:3478"] },
                { urls: ["stun:stun.qvod.com:3478"] },
                { urls: ["stun:stun.rackco.com:3478"] },
                { urls: ["stun:stun.rapidnet.de:3478"] },
                { urls: ["stun:stun.rb-net.com:3478"] },
                { urls: ["stun:stun.refint.net:3478"] },
                { urls: ["stun:stun.remote-learner.net:3478"] },
                { urls: ["stun:stun.rixtelecom.se:3478"] },
                { urls: ["stun:stun.rockenstein.de:3478"] },
                { urls: ["stun:stun.rolmail.net:3478"] },
                { urls: ["stun:stun.rounds.com:3478"] },
                { urls: ["stun:stun.rynga.com:3478"] },
                { urls: ["stun:stun.samsungsmartcam.com:3478"] },
                { urls: ["stun:stun.schlund.de:3478"] },
                { urls: ["stun:stun.services.mozilla.com:3478"] },
                { urls: ["stun:stun.sigmavoip.com:3478"] },
                { urls: ["stun:stun.sip.us:3478"] },
                { urls: ["stun:stun.sipdiscount.com:3478"] },
                { urls: ["stun:stun.sipgate.net:10000"] },
                { urls: ["stun:stun.sipgate.net:3478"] },
                { urls: ["stun:stun.siplogin.de:3478"] },
                { urls: ["stun:stun.sipnet.net:3478"] },
                { urls: ["stun:stun.sipnet.ru:3478"] },
                { urls: ["stun:stun.siportal.it:3478"] },
                { urls: ["stun:stun.sippeer.dk:3478"] },
                { urls: ["stun:stun.siptraffic.com:3478"] },
                { urls: ["stun:stun.skylink.ru:3478"] },
                { urls: ["stun:stun.sma.de:3478"] },
                { urls: ["stun:stun.smartvoip.com:3478"] },
                { urls: ["stun:stun.smsdiscount.com:3478"] },
                { urls: ["stun:stun.snafu.de:3478"] },
                { urls: ["stun:stun.softjoys.com:3478"] },
                { urls: ["stun:stun.solcon.nl:3478"] },
                { urls: ["stun:stun.solnet.ch:3478"] },
                { urls: ["stun:stun.sonetel.com:3478"] },
                { urls: ["stun:stun.sonetel.net:3478"] },
                { urls: ["stun:stun.sovtest.ru:3478"] },
                { urls: ["stun:stun.speedy.com.ar:3478"] },
                { urls: ["stun:stun.spokn.com:3478"] },
                { urls: ["stun:stun.srce.hr:3478"] },
                { urls: ["stun:stun.ssl7.net:3478"] },
                { urls: ["stun:stun.stunprotocol.org:3478"] },
                { urls: ["stun:stun.symform.com:3478"] },
                { urls: ["stun:stun.symplicity.com:3478"] },
                { urls: ["stun:stun.sysadminman.net:3478"] },
                { urls: ["stun:stun.t-online.de:3478"] },
                { urls: ["stun:stun.tagan.ru:3478"] },
                { urls: ["stun:stun.tatneft.ru:3478"] },
                { urls: ["stun:stun.teachercreated.com:3478"] },
                { urls: ["stun:stun.tel.lu:3478"] },
                { urls: ["stun:stun.telbo.com:3478"] },
                { urls: ["stun:stun.telefacil.com:3478"] },
                { urls: ["stun:stun.tis-dialog.ru:3478"] },
                { urls: ["stun:stun.tng.de:3478"] },
                { urls: ["stun:stun.twt.it:3478"] },
                { urls: ["stun:stun.u-blox.com:3478"] },
                { urls: ["stun:stun.ucallweconn.net:3478"] },
                { urls: ["stun:stun.ucsb.edu:3478"] },
                { urls: ["stun:stun.ucw.cz:3478"] },
                { urls: ["stun:stun.uls.co.za:3478"] },
                { urls: ["stun:stun.unseen.is:3478"] },
                { urls: ["stun:stun.usfamily.net:3478"] },
                { urls: ["stun:stun.veoh.com:3478"] },
                { urls: ["stun:stun.vidyo.com:3478"] },
                { urls: ["stun:stun.vipgroup.net:3478"] },
                { urls: ["stun:stun.virtual-call.com:3478"] },
                { urls: ["stun:stun.viva.gr:3478"] },
                { urls: ["stun:stun.vivox.com:3478"] },
                { urls: ["stun:stun.vline.com:3478"] },
                { urls: ["stun:stun.vo.lu:3478"] },
                { urls: ["stun:stun.vodafone.ro:3478"] },
                { urls: ["stun:stun.voicetrading.com:3478"] },
                { urls: ["stun:stun.voip.aebc.com:3478"] },
                { urls: ["stun:stun.voip.blackberry.com:3478"] },
                { urls: ["stun:stun.voip.eutelia.it:3478"] },
                { urls: ["stun:stun.voiparound.com:3478"] },
                { urls: ["stun:stun.voipblast.com:3478"] },
                { urls: ["stun:stun.voipbuster.com:3478"] },
                { urls: ["stun:stun.voipbusterpro.com:3478"] },
                { urls: ["stun:stun.voipcheap.co.uk:3478"] },
                { urls: ["stun:stun.voipcheap.com:3478"] },
                { urls: ["stun:stun.voipfibre.com:3478"] },
                { urls: ["stun:stun.voipgain.com:3478"] },
                { urls: ["stun:stun.voipgate.com:3478"] },
                { urls: ["stun:stun.voipinfocenter.com:3478"] },
                { urls: ["stun:stun.voipplanet.nl:3478"] },
                { urls: ["stun:stun.voippro.com:3478"] },
                { urls: ["stun:stun.voipraider.com:3478"] },
                { urls: ["stun:stun.voipstunt.com:3478"] },
                { urls: ["stun:stun.voipwise.com:3478"] },
                { urls: ["stun:stun.voipzoom.com:3478"] },
                { urls: ["stun:stun.vopium.com:3478"] },
                { urls: ["stun:stun.voxgratia.org:3478"] },
                { urls: ["stun:stun.voxox.com:3478"] },
                { urls: ["stun:stun.voys.nl:3478"] },
                { urls: ["stun:stun.voztele.com:3478"] },
                { urls: ["stun:stun.vyke.com:3478"] },
                { urls: ["stun:stun.webcalldirect.com:3478"] },
                { urls: ["stun:stun.whoi.edu:3478"] },
                { urls: ["stun:stun.wifirst.net:3478"] },
                { urls: ["stun:stun.wwdl.net:3478"] },
                { urls: ["stun:stun.xs4all.nl:3478"] },
                { urls: ["stun:stun.xtratelecom.es:3478"] },
                { urls: ["stun:stun.yesss.at:3478"] },
                { urls: ["stun:stun.zadarma.com:3478"] },
                { urls: ["stun:stun.zadv.com:3478"] },
                { urls: ["stun:stun.zoiper.com:3478"] },
                { urls: ["stun:stun1.faktortel.com.au:3478"] },
                { urls: ["stun:stun1.l.google.com:19302"] },
                { urls: ["stun:stun1.voiceeclipse.net:3478"] },
                { urls: ["stun:stun2.l.google.com:19302"] },
                { urls: ["stun:stun3.l.google.com:19302"] },
                { urls: ["stun:stun4.l.google.com:19302"] },
                { urls: ["stun:stunserver.org:3478"] },
                {
                    urls: ["turn:20.56.33.118:3478"],
                    username: "turnuser",
                    credential: "Wonder9595",
                    credentialType: "password",
                },
                {
                    // urls: ['turn:51.116.99.76:3478'],
                    urls: [
                        "turn:webrtcwondermove.germanywestcentral.cloudapp.azure.com:443?transport=tcp",
                    ],
                    username: "turnuser",
                    credential: "Wonder9595",
                    credentialType: "password",
                },
                {
                    urls: ["turn:20.39.188.117:3478"],
                    username: "turnuser",
                    credential: "Wonder9595",
                    credentialType: "password",
                },
            ],
        },
    };
    var peerSlave = __assign(__assign({}, peerMaster), { host: SERVER_SLAVE_URI });
    /**
     * 1. 딜ㄹ러 입장 시 로컬스트림 켜짐
     * 2. 접속 시 소켓 또는 알디 연동
     * 3. customerJoinYn 값 필요 -
     *  - true이면
     *
     */
    // 함수들 ~
    var setLocalStreamVideo = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var s, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!navigator.mediaDevices) return [3 /*break*/, 2];
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true,
                        })];
                case 1:
                    s = _a.sent();
                    setLocalStream(s);
                    _a.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [mediaDevices, cameraOnYn, micOnYn, localStream]);
    var setMediaStreamVideo = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var s, stream_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!navigator.mediaDevices) return [3 /*break*/, 3];
                    return [4 /*yield*/, navigator.mediaDevices.getDisplayMedia({
                            video: true,
                            audio: false,
                        })];
                case 1:
                    s = _a.sent();
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: false,
                            audio: true,
                        })];
                case 2:
                    stream_1 = _a.sent();
                    s.addTrack(stream_1.getAudioTracks()[0]);
                    s.addEventListener("inactive", function (e) {
                        console.log("local inactive");
                        // setMicOnYn(false);
                        // setCameraOnYn(false);
                    });
                    s.addEventListener("active", function (e) {
                        console.log("local active");
                        setMicOnYn(true);
                        setCameraOnYn(true);
                    });
                    s.getVideoTracks().forEach(function (i) {
                        i.addEventListener("mute", function (e) {
                            console.log("local camera muted!");
                            // setCameraOnYn(false);
                            // setConnectError(true);
                        });
                        i.addEventListener("unmute", function (e) {
                            console.log("local camera unmuted!");
                            // setCameraOnYn(true);
                            // setConnectError(true);
                        });
                    });
                    s.getAudioTracks().forEach(function (i) {
                        i.addEventListener("mute", function (e) {
                            console.log("local mic muted!");
                            setMicOnYn(false);
                            // setConnectError(true);
                        });
                        i.addEventListener("unmute", function (e) {
                            console.log("local mic unmuted!");
                            setMicOnYn(true);
                            // setConnectError(true);
                        });
                    });
                    setLocalStream(s);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [mediaDevices, cameraOnYn, micOnYn, localStream]);
    var findDestination = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, room, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (chatRoomId == null)
                        return [2 /*return*/, alert("please enter chatroom id")];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setFinding(true);
                    console.log("peerId", peerId);
                    return [4 /*yield*/, axios_1.default.get("".concat(WEBRTC_ROOM_URI, "/peers/room"), {
                            params: {
                                roomId: chatRoomId,
                                userType: userType.toLowerCase(),
                                peerId: peerId,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    room = response.data.room;
                    console.log("found destination: ", room);
                    if (userType === "CUSTOMER") {
                        if (room === null || room === void 0 ? void 0 : room.manager) {
                            setDestination(room.manager);
                        }
                    }
                    else {
                        if (room === null || room === void 0 ? void 0 : room.customer) {
                            setDestination(room.customer);
                        }
                    }
                    return [3 /*break*/, 5];
                case 3:
                    e_3 = _a.sent();
                    console.error(e_3);
                    return [3 /*break*/, 5];
                case 4:
                    setFinding(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [chatRoomId, userType, peerId]);
    var connect = (0, react_1.useCallback)(function () {
        console.log("Connecting to ".concat(destination, "..."));
        setConnecting(true);
        try {
            if (!local)
                throw new Error("localPeer not defined");
            if (!localStream)
                throw new Error("localStream not defined");
            if (!destination)
                throw new Error("destination not defined");
            var conn = local.connect(destination);
            conn.on("data", function (data) {
                setConnected(true);
                setConnecting(false);
                console.log("received: ".concat(data));
            });
            conn.on("open", function () {
                console.log("opened");
                setConnected(true);
                setConnecting(false);
            });
            conn.on("error", function (e) {
                console.log("connect error", e);
                setConnected(false);
                setConnecting(false);
            });
        }
        catch (e) {
            console.log("connect error 2", e);
        }
        finally {
            setConnecting(false);
        }
    }, [destination, localStream, local]);
    var handleStream = (0, react_1.useCallback)(function (stream) {
        setStartTime(function (prev) { return prev || (0, moment_1.default)(); });
        console.log("navis calling 2 aaa", stream);
        // `stream` is the MediaStream of the remote peer.m
        // Here you'd add it to an HTML video/canvas element.
        setRemoteStream(stream);
    }, [localStream]);
    var startCall = (0, react_1.useCallback)(function () {
        console.log("method startCall() called", local, destination, localStream);
        if (!local)
            throw new Error("localPeer not defined");
        if (!destination)
            throw new Error("destination not defined");
        if (!localStream)
            throw new Error("localstream not defined");
        local.on("call", function (call) {
            console.log("localPeer has received call");
            console.log("localStream is ", localStream);
            // Answer the call, providing our mediaStream
            if (localStream != null) {
                // console.log('navis calling aaa', localStream);
                call.answer(localStream);
                call.on("stream", function (stream) {
                    handleStream(stream);
                });
                call.on("close", function () {
                    setRemoteStream(null);
                });
                call.on("error", function (e) {
                    console.log(e);
                    setRemoteStream(null);
                    setConnected(false);
                });
            }
        });
        try {
            var call = local.call(destination, localStream);
            call === null || call === void 0 ? void 0 : call.on("stream", function (stream) {
                handleStream(stream);
            });
            console.log(call);
            call.on("error", function (e) {
                console.log("call connection errored", e);
            });
            call.on("close", function () {
                console.log("call connection closed");
            });
            setMediaConnection(call);
        }
        catch (e) {
            setConnected(false);
            console.log(e);
        }
        finally {
            setConnecting(false);
        }
    }, [local, destination, localStream, remoteStream]);
    var stop = (0, react_1.useCallback)(function () {
        console.log("stop", localStream, remoteStream);
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(function (mediaStream) {
            mediaStream.getTracks().forEach(function (track) {
                track.stop();
                localStream === null || localStream === void 0 ? void 0 : localStream.removeTrack(track);
                console.log("track stopped");
            });
        });
        if (localStream) {
            localStream.getTracks().forEach(function (track) {
                // track.stop();
                track.stop();
                localStream.removeTrack(track);
            });
            setLocalStream(null);
        }
        if (local)
            local.disconnect();
        if (mediaConnection)
            mediaConnection.close();
        if (remoteStream) {
            // localStream.removeTrack(); // localStream.release();
            remoteStream.getTracks().forEach(function (track) {
                track.stop();
                remoteStream.removeTrack(track);
            });
            setRemoteStream(null);
        }
        setPeerId(null);
        setDestination(null);
    }, [localStream, remoteStream, local, mediaConnection]);
    var leaveSocket = (0, react_1.useCallback)(function () {
        console.log("leave");
        socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.emit("leave", { roomId: chatRoomId, sender: "DEALER" });
        setLeftYn(true);
    }, [socketInstance, chatRoomId]);
    // ** Hooks
    (0, react_1.useEffect)(function () {
        var socket;
        console.log("socket icandoit");
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, socketInitializer(chatRoomId)];
                    case 1:
                        socket = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            console.log("socket off");
            if (socket) {
                // socket.emit('leave', { roomId: chatRoomId, sender: 'DEALER' });
                socket.disconnect();
            }
        };
    }, [connected]);
    //** Socket Initializer
    var socketInitializer = function (_id) { return __awaiter(void 0, void 0, void 0, function () {
        var manager, socket;
        return __generator(this, function (_a) {
            manager = new socket_io_client_1.Manager(SOCKET_URI, { transports: ["websocket"] });
            socket = manager.socket(SOCKET_NAMESPACE);
            socket.on("connect", function () {
                console.log("socket join, { roomId: ".concat(_id, ", sender: 'DEALER' }"));
                socket.emit("join", { roomId: _id, sender: "DEALER" });
                console.log(micOnYn, cameraOnYn);
                socket.emit("microphone", {
                    roomId: _id,
                    sender: "DEALER",
                    onYn: micOnYn,
                });
                socket.emit("camera", {
                    roomId: _id,
                    sender: "DEALER",
                    onYn: cameraOnYn,
                });
            });
            socket.on("microphone", function (_a) {
                var roomId = _a.roomId, sender = _a.sender, onYn = _a.onYn;
                var isMe = sender === "DEALER";
                if (!isMe) {
                    console.log("socket mic listener onYn : ", onYn);
                    setCustomerMicOnYn(onYn);
                }
            });
            socket.on("camera", function (_a) {
                var roomId = _a.roomId, sender = _a.sender, onYn = _a.onYn;
                var isMe = sender === "DEALER";
                if (!isMe) {
                    console.log("socket camera listener onYn : ", onYn);
                    setCustomerCameraOnYn(onYn);
                }
            });
            socket.on("leave", function (_a) {
                var roomId = _a.roomId, sender = _a.sender;
                var isMe = sender === "DEALER";
                console.log("leave", sender);
                if (!isMe) {
                    setCustomerLeftYn(true);
                }
                else {
                    setLeftYn(true);
                }
            });
            socket.on("consultError", function (_a) {
                var consultId = _a.consultId, sender = _a.sender;
                var isMe = sender === "DEALER";
                if (!isMe) {
                    // onRefresh();
                    setNetworkErrored(true);
                }
            });
            setSocketInstance(socket);
            return [2 /*return*/, socket];
        });
    }); };
    // 1. 딜러 입장 시 로컬스트림 세팅
    (0, react_1.useEffect)(function () {
        console.log("1. 딜러 입장 시 로컬스트림 세팅", localStream);
        if (localStream == null) {
            setLocalStreamVideo();
        }
        return function () {
            console.log("aa=====");
            stop();
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (localStream && socketInstance) {
            if (localStream.getVideoTracks()) {
                localStream.getVideoTracks()[0].enabled = cameraOnYn;
                console.log("camera on? off? " + cameraOnYn);
                socketInstance.emit("camera", {
                    roomId: chatRoomId,
                    sender: "DEALER",
                    onYn: cameraOnYn,
                });
            }
        }
    }, [cameraOnYn]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (localStream && socketInstance) {
            if (((_a = localStream.getAudioTracks()) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                localStream.getAudioTracks()[0].enabled = micOnYn;
                console.log("mic on? off? " + micOnYn);
                socketInstance.emit("microphone", {
                    roomId: chatRoomId,
                    sender: "DEALER",
                    onYn: micOnYn,
                });
            }
        }
    }, [micOnYn]);
    // test 용으로 추가
    (0, react_1.useEffect)(function () {
        var _a;
        if (remoteStream) {
            if (((_a = remoteStream.getVideoTracks()) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                remoteStream.getVideoTracks()[0].enabled = customerCameraOnYn;
                console.log("remote camera on? off? " + customerCameraOnYn);
            }
        }
    }, [customerCameraOnYn]);
    // test 용으로 추가
    (0, react_1.useEffect)(function () {
        var _a;
        if (remoteStream) {
            if (((_a = remoteStream.getAudioTracks()) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                remoteStream.getAudioTracks()[0].enabled = customerMicOnYn;
                console.log("remote mic on? off? " + customerMicOnYn);
            }
        }
    }, [customerMicOnYn]);
    // // 2. 로컬 Peer id 받고
    (0, react_1.useEffect)(function () {
        console.log("로컬 peerid 세팅을 시작", peerId);
        if (peerId == null && localStream != null) {
            Promise.resolve().then(function () { return __importStar(require("peerjs")); }).then(function (_a) {
                var Peer = _a.default;
                console.log("peerjs import");
                // normal synchronous code
                var localPeer = new Peer(peerMaster);
                setLocal(localPeer);
                console.log("localPeer", localPeer);
            })
                .catch(function (e) {
                console.error(e);
            });
        }
        return function () {
            setLocal(null);
        };
    }, [localStream]);
    (0, react_1.useEffect)(function () {
        console.log("local peer changed");
        if (local) {
            local.on("open", function (localPeerId) {
                console.log("Local peer open with ID", localPeerId);
                setPeerId(localPeerId);
            });
            local.on("connection", function (conn) {
                console.log("Local peer has received connection.");
                setConnected(true);
                setConnecting(false);
                setPeerErrorMessage(null);
                setNetworkErrored(false);
                // setDestination()
                setDestination(conn.peer);
                conn.on("error", function (e) {
                    console.log(e);
                    // setConnected(false);
                    setConnecting(false);
                });
                conn.on("open", function () {
                    setConnected(true);
                    setConnecting(false);
                    console.log("Local peer has opened connection.", conn.peer);
                    // conn.on('data', (data) => console.log('Received from remote peer', data));
                    console.log("Local peer sending data.");
                    conn.send("Hello, this is the LOCAL peer!");
                });
            });
            local.on("call", function (mediaConnection) {
                console.log("local Peer on call ", mediaConnection);
                if (!destination)
                    setDestination(mediaConnection.peer);
                if (userType === "CUSTOMER") {
                    if (localStream == null)
                        throw new Error("localstream is not defined");
                    mediaConnection.answer(localStream);
                    mediaConnection.on("stream", function (stream) {
                        handleStream(stream);
                    });
                    mediaConnection.on("close", function () {
                        setRemoteStream(null);
                    });
                    mediaConnection.on("error", function (e) {
                        console.log(e);
                        setRemoteStream(null);
                        setConnected(false);
                    });
                }
            });
            local.on("close", function () {
                console.log("local Peer closed ");
            });
            local.on("disconnected", function () {
                console.log("Local peer disconnected. trying to connect using slave server.");
                console.log("setlocal start");
                var peer = new peerjs_1.default(peerSlave);
                setLocal(peer);
                console.log("setlocal called");
            });
            local.on("error", function (e) {
                console.log("Local peer has got errored ", e);
                if (e["type"] === "network") {
                    // modal 출력
                    setNetworkErrored(true);
                }
                setPeerErrorMessage("An error has occured while connecting. ECODE: " + e["type"]);
                // console.log(this.state.myId, 'peer.eeror', error.type);
                // var interval = setTimeout(function () {
                //   if (localPeer.open === true || localPeer.destroyed === true) {
                //     clearInterval(interval);
                //   } else {
                //     localPeer.reconnect();
                //   }
                // }, 5000);
            });
        }
    }, [local]);
    // 3. 받아온 peer id를  rtc 서버에 등록하고, 상대방 아이디가 있는지 확인함
    (0, react_1.useEffect)(function () {
        if (peerId) {
            console.log("peerid: ", peerId, ", finding destination");
            findDestination();
        }
    }, [peerId]);
    // 4. 상대방 아이디 있으면 연결한다.
    (0, react_1.useEffect)(function () {
        if (!connecting)
            if (destination && peerId) {
                console.log("destination found: ", destination, ", trying to connect");
                connect();
            }
    }, [destination, peerId, connecting]);
    (0, react_1.useEffect)(function () {
        if (localStream) {
            setCameraOnYn(true);
            setMicOnYn(true);
        }
        else {
        }
    }, [localStream]);
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        if (remoteStream) {
            remoteStream === null || remoteStream === void 0 ? void 0 : remoteStream.addEventListener("inactive", function (e) {
                console.log("remote inactive");
                setStreamCameraErrored(true);
                setStreamMicErrored(true);
                // setCustomerCameraOnYn(false);
                // setCustomerMicOnYn(false);
            });
            remoteStream === null || remoteStream === void 0 ? void 0 : remoteStream.addEventListener("active", function (e) {
                console.log("remote active");
                setStreamCameraErrored(false);
                setStreamMicErrored(false);
            });
            if (remoteStream.getVideoTracks().length > 0) {
                console.log(remoteStream.getVideoTracks());
                (_a = remoteStream === null || remoteStream === void 0 ? void 0 : remoteStream.getVideoTracks()[0]) === null || _a === void 0 ? void 0 : _a.addEventListener("mute", function (e) {
                    console.log("remote camera muted!");
                    setStreamCameraErrored(true);
                    // setCustomerCameraOnYn(false);
                    // setConnectError(true);
                });
                (_b = remoteStream === null || remoteStream === void 0 ? void 0 : remoteStream.getVideoTracks()[0]) === null || _b === void 0 ? void 0 : _b.addEventListener("unmute", function (e) {
                    console.log("remote camera unmuted!");
                    setStreamCameraErrored(false);
                    // setCustomerCameraOnYn(true);
                    // setConnectError(true);
                });
            }
            if (remoteStream.getAudioTracks().length > 0) {
                (_c = remoteStream
                    .getAudioTracks()[0]) === null || _c === void 0 ? void 0 : _c.addEventListener("mute", function (e) {
                    console.log("remote mic muted!");
                    setStreamMicErrored(true);
                    // setCustomerMicOnYn(false);
                    // setConnectError(true);
                });
                (_d = remoteStream
                    .getAudioTracks()[0]) === null || _d === void 0 ? void 0 : _d.addEventListener("unmute", function (e) {
                    console.log("remote mic unmuted!");
                    setStreamMicErrored(false);
                    // setCustomerMicOnYn(true);
                    // setConnectError(true);
                });
            }
        }
        else {
        }
    }, [remoteStream]);
    // useEffect(() => {
    //   if (localStream && destination && local) {
    //     if (connected && userType === "DEALER") startCall();
    //   }
    // }, [local, destination, localStream]);
    // 5. 연결됐으면 call 후 remoteStream을 받아온다.
    (0, react_1.useEffect)(function () {
        if (connected && userType === "DEALER") {
            if (localStream && destination && local) {
                console.log("connected!");
                startCall();
            }
        }
    }, [connected]);
    (0, react_1.useEffect)(function () {
        console.log("screensharing", screenSharingYn);
        if (screenSharingYn) {
            setMediaStreamVideo();
        }
        else {
            setLocalStreamVideo();
        }
    }, [screenSharingYn]);
    (0, react_1.useEffect)(function () {
        // console.log('remoteStream : ', remoteStream);
        if (remotePlayerRef.current && remoteStream)
            remotePlayerRef.current.srcObject = remoteStream ? remoteStream : null;
        return function () {
            var _a;
            if (remotePlayerRef.current) {
                (_a = remotePlayerRef.current.srcObject) === null || _a === void 0 ? void 0 : _a.getTracks().forEach(function (track) {
                    track.stop();
                });
                remotePlayerRef.current.srcObject = null;
            }
        };
    }, [remoteStream]);
    (0, react_1.useEffect)(function () {
        // console.log('localstream : ', localStream);
        if (playerRef.current && localStream)
            playerRef.current.srcObject = localStream ? localStream : null;
        return function () {
            var _a;
            if (playerRef.current) {
                (_a = playerRef.current.srcObject) === null || _a === void 0 ? void 0 : _a.getTracks().forEach(function (track) {
                    track.stop();
                });
                playerRef.current.srcObject = null;
            }
        };
    }, [localStream]);
    (0, react_1.useEffect)(function () {
        // return ()=>{
        //   stop();
        //   playerRef.current?.pause();
        //   remotePlayerRef.current?.pause();
        // }
    });
    (0, react_1.useEffect)(function () {
        setNetworkOnline(navigator.onLine);
    }, [navigator.onLine]);
    (0, react_1.useEffect)(function () {
        if (networkOnline) {
            // onRefresh();
            // setNetworkErrored(false);
        }
        else {
            // setConnecting(true);
            // setTimeout(() => {
            console.log("offline");
            setNetworkErrored(true);
            // }, 1500);
        }
    }, [networkOnline]);
    var onRefresh = (0, react_1.useCallback)(function () {
        setNetworkErrored(false);
        if (!networkOnline) {
            setTimeout(function () {
                setNetworkErrored(true);
            }, 1500);
            return;
        }
        else {
            findDestination();
        }
    }, [networkOnline]);
    (0, react_1.useEffect)(function () {
        if (networkErrored && socketInstance) {
            socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.emit("consultError", {
                consultId: chatRoomId,
                sender: "DEALER",
            });
        }
    }, [networkErrored]);
    // // 얜 뭐지
    // useEffect(() => {
    //   setFinding(false);
    //   setConnected(false);
    //   setConnecting(false);
    //   setRemoteStream(null);
    // }, [destination, peerId]);
    (0, react_1.useEffect)(function () {
        if (startTime) {
            var interval_1 = setInterval(function () {
                setTimeDiff((0, moment_1.default)().diff(startTime, "seconds"));
            }, 1000);
            return function () {
                setTimeDiff(0);
                clearInterval(interval_1);
            };
        }
    }, [startTime]);
    var mediaStatus = (0, react_1.useMemo)(function () { return ({
        cameraOnYn: cameraOnYn,
        micOnYn: micOnYn,
        screenSharingYn: screenSharingYn,
        customerMicOnYn: customerMicOnYn,
        customerCameraOnYn: customerCameraOnYn,
    }); }, [cameraOnYn, micOnYn, screenSharingYn, customerMicOnYn, customerCameraOnYn]);
    var connectStatus = (0, react_1.useMemo)(function () { return ({
        connecting: connecting,
        connected: connected,
        finding: finding,
        peerId: peerId,
        destination: destination,
        customerLeftYn: customerLeftYn,
        leftYn: leftYn,
        timeDiff: timeDiff,
        peerErrorMessage: peerErrorMessage,
        streamCameraErrored: streamCameraErrored,
        streamMicErrored: streamMicErrored,
        networkErrored: networkErrored,
    }); }, [
        connecting,
        connected,
        finding,
        peerId,
        destination,
        customerLeftYn,
        leftYn,
        timeDiff,
        peerErrorMessage,
        streamCameraErrored,
        streamMicErrored,
        networkErrored,
    ]);
    var stream = (0, react_1.useMemo)(function () {
        return { localStream: localStream, remoteStream: remoteStream };
    }, [localStream, remoteStream]);
    return {
        mediaStatus: mediaStatus,
        connectStatus: connectStatus,
        stream: stream,
        setCameraOnYn: setCameraOnYn,
        setMicOnYn: setMicOnYn,
        setScreenSharingYn: setScreenSharingYn,
        onStop: stop,
        onStart: setLocalStreamVideo,
        leaveSocket: leaveSocket,
        onRefresh: onRefresh,
        socketInstance: socketInstance,
        player: {
            playerRef: playerRef,
            remotePlayerRef: remotePlayerRef,
        },
    };
};
exports.default = Rtc;
