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
var socket_io_client_1 = require("socket.io-client");
var moment_1 = __importDefault(require("moment"));
var Rtc = function (_a) {
    var _b = _a.chatRoomId, chatRoomId = _b === void 0 ? "testChatroom" : _b, dealerYn = _a.dealerYn, _c = _a.cameraDefaultOnYn, cameraDefaultOnYn = _c === void 0 ? true : _c, _d = _a.micDefaultOnYn, micDefaultOnYn = _d === void 0 ? true : _d, _e = _a.config, SOCKET_URI = _e.SOCKET_URI, SOCKET_NAMESPACE = _e.SOCKET_NAMESPACE, WEBRTC_URI = _e.WEBRTC_URI, WEBRTC_SLAVE_URI = _e.WEBRTC_SLAVE_URI, WEBRTC_PORT = _e.WEBRTC_PORT, WEBRTC_ROOM_URI = _e.WEBRTC_ROOM_URI, WEBRTC_PATH = _e.WEBRTC_PATH, SIGNAL_SOCKET_URI = _e.SIGNAL_SOCKET_URI, SIGNAL_SOCKET_NAMESPACE = _e.SIGNAL_SOCKET_NAMESPACE;
    var SERVER_URI = WEBRTC_URI;
    var SERVER_SLAVE_URI = WEBRTC_SLAVE_URI;
    var SERVER_PORT = parseInt(WEBRTC_PORT);
    var _f = (0, react_1.useState)(cameraDefaultOnYn), cameraOnYn = _f[0], setCameraOnYn = _f[1];
    var _g = (0, react_1.useState)(micDefaultOnYn), micOnYn = _g[0], setMicOnYn = _g[1];
    var _h = (0, react_1.useState)(false), deviceChangeStartYn = _h[0], setDeviceChangeStartYn = _h[1]; //내가 changing 중인지
    var _j = (0, react_1.useState)(0), cardOpenedIndex = _j[0], setCardOpenedIndex = _j[1];
    var _k = (0, react_1.useState)(false), screenSharingYn = _k[0], setScreenSharingYn = _k[1];
    var _l = (0, react_1.useState)(), localStream = _l[0], setLocalStream = _l[1];
    var _m = (0, react_1.useState)(), remoteStream = _m[0], setRemoteStream = _m[1];
    var _o = (0, react_1.useState)(), peerId = _o[0], setPeerId = _o[1];
    var _p = (0, react_1.useState)(), destination = _p[0], setDestination = _p[1];
    var _q = (0, react_1.useState)(), mediaConnection = _q[0], setMediaConnection = _q[1];
    var _r = (0, react_1.useState)(false), finding = _r[0], setFinding = _r[1];
    var _s = (0, react_1.useState)(false), connected = _s[0], setConnected = _s[1];
    var _t = (0, react_1.useState)(false), connecting = _t[0], setConnecting = _t[1];
    var _u = (0, react_1.useState)(), local = _u[0], setLocal = _u[1];
    var _v = (0, react_1.useState)(), mediaDevices = _v[0], setMediaDevices = _v[1];
    var _w = (0, react_1.useState)(), peerErrorMessage = _w[0], setPeerErrorMessage = _w[1];
    var _x = (0, react_1.useState)(), streamCameraErrored = _x[0], setStreamCameraErrored = _x[1];
    var _y = (0, react_1.useState)(), streamMicErrored = _y[0], setStreamMicErrored = _y[1];
    var _z = (0, react_1.useState)(false), networkErrored = _z[0], setNetworkErrored = _z[1];
    var _0 = (0, react_1.useState)(navigator.onLine), networkOnline = _0[0], setNetworkOnline = _0[1];
    var _1 = (0, react_1.useState)(false), deviceSwitchRequested = _1[0], setDeviceSwitchRequested = _1[1];
    var _2 = (0, react_1.useState)(false), deviceSwitchSucceeded = _2[0], setDeviceSwitchSucceeded = _2[1];
    var _3 = (0, react_1.useState)(false), deviceSwitchingYn = _3[0], setDeviceSwitchingYn = _3[1]; // 상대방이 changing 중인지
    // modal errored
    var _4 = (0, react_1.useState)(), peerModalErrorMessage = _4[0], setPeerModalErrorMessage = _4[1];
    var _5 = (0, react_1.useState)(true), customerMicOnYn = _5[0], setCustomerMicOnYn = _5[1];
    var _6 = (0, react_1.useState)(true), customerCameraOnYn = _6[0], setCustomerCameraOnYn = _6[1];
    var _7 = (0, react_1.useState)(false), customerLeftYn = _7[0], setCustomerLeftYn = _7[1];
    var _8 = (0, react_1.useState)(), socketInstance = _8[0], setSocketInstance = _8[1];
    var _9 = (0, react_1.useState)(), webRtcSocketInstance = _9[0], setWebRtcSocketInstance = _9[1];
    var _10 = (0, react_1.useState)([]), remoteCandidates = _10[0], setRemoteCandidates = _10[1];
    var _11 = (0, react_1.useState)(false), peerJoinYn = _11[0], setPeerJoinYn = _11[1];
    var _12 = (0, react_1.useState)(false), leftYn = _12[0], setLeftYn = _12[1];
    var _13 = (0, react_1.useState)(), startTime = _13[0], setStartTime = _13[1];
    var _14 = (0, react_1.useState)(0), timeDiff = _14[0], setTimeDiff = _14[1];
    var _15 = (0, react_1.useState)(false), negotiationNeeded = _15[0], setNegotiationNeeded = _15[1];
    var _16 = (0, react_1.useState)(false), answerNeeded = _16[0], setAnswerNeeded = _16[1];
    /// 다시한번 시작해
    var userType = dealerYn ? "DEALER" : "CUSTOMER";
    var playerRef = (0, react_1.useRef)();
    var remotePlayerRef = (0, react_1.useRef)();
    var webRtcSocketRef = (0, react_1.useRef)();
    var peerConnectionRef = (0, react_1.useRef)();
    var localStreamRef = (0, react_1.useRef)();
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
    var socketRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        //1)
        var socket;
        var localStream = new MediaStream();
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var manager, _id;
            return __generator(this, function (_a) {
                manager = new socket_io_client_1.Manager(SOCKET_URI, { transports: ["websocket"] });
                socket = manager.socket(SOCKET_NAMESPACE); // main namespace
                _id = chatRoomId;
                socket.on("connect", function () {
                    console.log("socket join, { roomId: ".concat(_id, ", sender: '").concat(userType, "', camera: ").concat(cameraOnYn, ", mic: ").concat(micOnYn, " }"));
                    socket.emit("join", {
                        roomId: _id,
                        sender: userType,
                        // cameraOnYn,
                        // microphoneOnYn: micOnYn,
                    });
                    if (userType === "DEALER") {
                        socket.emit("switchDevice", {
                            roomId: _id,
                            sender: userType,
                            deviceType: "WEB",
                            switchStatus: "SUCCESS",
                        });
                    }
                });
                socket.on("microphone", function (_a) {
                    var roomId = _a.roomId, sender = _a.sender, onYn = _a.onYn;
                    var isMe = sender === userType;
                    if (!isMe) {
                        console.log("peer socket mic listener onYn : ", onYn);
                        setCustomerMicOnYn(onYn);
                    }
                });
                socket.on("camera", function (_a) {
                    var roomId = _a.roomId, sender = _a.sender, onYn = _a.onYn;
                    var isMe = sender === userType;
                    if (!isMe) {
                        console.log("socket camera listener onYn : ", onYn);
                        setCustomerCameraOnYn(onYn);
                    }
                });
                socket.on("leave", function (_a) {
                    var roomId = _a.roomId, sender = _a.sender;
                    var isMe = sender === userType;
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
                    var isMe = sender === userType;
                    if (!isMe) {
                        // onRefresh();
                        setNetworkErrored(true);
                    }
                });
                socket.on("switchDevice", function (_a) {
                    var roomId = _a.roomId, sender = _a.sender, deviceType = _a.deviceType, switchStatus = _a.switchStatus;
                    if (sender === "DEALER") {
                        if (userType === "CUSTOMER") {
                            if (switchStatus === "ALLOW") {
                                console.log("deviceSwitching:: allow socket received");
                                onRefresh();
                            }
                        }
                        if (userType === "DEALER") {
                            if (switchStatus === "REQUEST" && deviceType === "MOBILE") {
                                setDeviceSwitchRequested(true);
                            }
                            if (switchStatus === "SUCCESS" &&
                                deviceType === "MOBILE" //&&
                            // deviceSwitchingYn
                            ) {
                                // 끄기
                                console.log("deviceSwitching:: success", switchStatus, sender, deviceSwitchRequested, deviceSwitchingYn);
                                setDeviceSwitchSucceeded(true);
                                setDeviceSwitchingYn(false);
                            }
                            if (switchStatus === "REJECT") {
                                // 끄기
                                console.log("deviceSwitching:: reject ", switchStatus, sender, deviceSwitchRequested);
                                setDeviceSwitchingYn(false); //필요한가?
                            }
                        }
                    }
                });
                socketRef.current = socket;
                localStreamRef.current = localStream;
                console.log("localstream", localStream);
                return [2 /*return*/];
            });
        }); })();
        return function () {
            console.log("socket off");
            if (socket) {
                socket.disconnect();
                socketRef.current = undefined;
            }
            stop(deviceSwitchingYn);
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (playerRef.current) {
            console.log("playerref", playerRef.current, localStreamRef.current);
            playerRef.current.srcObject = localStreamRef.current;
        }
    }, [playerRef.current, localStreamRef.current]);
    (0, react_1.useEffect)(function () {
        //1)
        var socket;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var manager, _id, candidates;
            return __generator(this, function (_a) {
                manager = new socket_io_client_1.Manager(SIGNAL_SOCKET_URI, {
                    transports: ["websocket", "polling"],
                    secure: true,
                });
                socket = manager.socket(SIGNAL_SOCKET_NAMESPACE); // main nakmespace
                _id = chatRoomId;
                socket.on("connect", function () {
                    console.log("webrtc socket connected");
                    socket.emit("join_room", { room: chatRoomId, sender: userType });
                });
                candidates = [];
                socket.on("getCandidate", function (_a) {
                    var candidate = _a.candidate, sender = _a.sender;
                    try {
                        var isMe = sender === userType;
                        if (!isMe) {
                            console.log("getCandidate socket received - customer", candidate, peerConnectionRef.current.connectionState);
                            var newCandidate = new RTCIceCandidate(candidate);
                            if (peerConnectionRef.current.signalingState == "closed")
                                return;
                            if (peerConnectionRef.current.remoteDescription) {
                                if (newCandidate) {
                                    peerConnectionRef.current.addIceCandidate(newCandidate);
                                }
                            }
                            else {
                                candidates.push(newCandidate);
                            }
                        }
                    }
                    catch (e) {
                        console.error("getCandidate ~ error ~", e);
                    }
                });
                socket.on("all_users", function (all_users) {
                    console.log("all_users socket received", all_users);
                    var users = all_users.filter(function (i) { return i.sender !== userType; });
                    var len = users.length;
                    console.log("all_users length!!!", len);
                    //* room에 두명 이상 있을 시 handshake 로직 시작
                    if (userType === "DEALER") {
                        if (len > 0) {
                            setPeerJoinYn(true);
                        }
                    }
                });
                socket.on("disconnect", function (reason) {
                    console.log("socket disconnected by", reason); // "ping timeout"
                    // webRtcSocketRef.current = undefined;
                    // socket.connect();
                });
                if (userType === "CUSTOMER") {
                    socket.on("getOffer", function (_a) {
                        var sdp = _a.sdp, sender = _a.sender;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var isMe, offerDescription;
                            return __generator(this, function (_b) {
                                isMe = sender === userType;
                                console.log("offer socket received", sdp, local);
                                if (!isMe) {
                                    console.log("peerconnection:: connectionstate ", peerConnectionRef.current.connectionState, deviceSwitchingYn);
                                    if (peerConnectionRef.current.signalingState == "closed")
                                        return [2 /*return*/];
                                    try {
                                        offerDescription = new RTCSessionDescription(sdp);
                                        peerConnectionRef.current.setRemoteDescription(offerDescription);
                                    }
                                    catch (e) {
                                        console.log("error:", e, "deviceSwitching:", deviceSwitchingYn);
                                        if (deviceSwitchingYn) {
                                        }
                                    }
                                    setAnswerNeeded(true);
                                    try {
                                        if (candidates.length > 0) {
                                            candidates.map(function (i) { return peerConnectionRef.current.addIceCandidate(i); });
                                            candidates = [];
                                        }
                                    }
                                    catch (e) { }
                                }
                                return [2 /*return*/];
                            });
                        });
                    });
                }
                else {
                    socket.on("getAnswer", function (_a) {
                        var sdp = _a.sdp, sender = _a.sender;
                        console.log("webrtc socket get Answer, local, offer", peerConnectionRef.current, sdp, sender);
                        if (peerConnectionRef.current.signalingState == "closed")
                            return;
                        try {
                            var isMe = sender === userType;
                            if (!isMe) {
                                console.log("answer socket get", sdp, peerConnectionRef.current, candidates);
                                var offerDescription = new RTCSessionDescription(sdp);
                                peerConnectionRef.current.setRemoteDescription(offerDescription);
                                if (candidates.length > 0) {
                                    candidates.map(function (i) { return peerConnectionRef.current.addIceCandidate(i); });
                                    candidates = [];
                                }
                            }
                        }
                        catch (e) {
                            console.error("sendAnswer ~ error ~", e);
                        }
                    });
                }
                webRtcSocketRef.current = socket;
                return [2 /*return*/];
            });
        }); })();
        return function () {
            console.log("socket off");
            if (socket) {
                socket.disconnect();
                webRtcSocketRef.current = undefined;
            }
        };
    }, []);
    (0, react_1.useEffect)(function () {
        console.log("answer needed Effect", answerNeeded, localStreamRef.current);
        if (answerNeeded && localStreamRef.current) {
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var answerDescription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peerConnectionRef.current.createAnswer()];
                        case 1:
                            answerDescription = _a.sent();
                            peerConnectionRef.current.setLocalDescription(answerDescription);
                            console.log("send answer!!", peerConnectionRef.current);
                            webRtcSocketRef.current.emit("answer", {
                                sdp: answerDescription,
                                sender: userType,
                            });
                            setAnswerNeeded(false);
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
    }, [answerNeeded, localStreamRef.current]);
    (0, react_1.useEffect)(function () {
        if (webRtcSocketRef.current) {
            var peerConnection_1 = initPeerConnection();
            peerConnectionRef.current = peerConnection_1;
            return function () {
                console.log("peerConnection: close");
                peerConnection_1.close();
                peerConnectionRef.current = undefined;
                setNegotiationNeeded(false);
                setPeerJoinYn(false);
            };
        }
    }, [webRtcSocketRef.current]);
    var initPeerConnection = function () {
        var peerConstraints = {
            iceServers: peerMaster.config.iceServers,
        };
        var peerConnection = new RTCPeerConnection(peerConstraints);
        console.log("peerConnection init!");
        setConnecting(true);
        setConnected(false);
        peerConnection.addEventListener("track", function (e) {
            console.log("peerConnection:: on track ", e);
            setRemoteStream(e.streams[0]);
        });
        peerConnection.addEventListener("connectionstatechange", function (e) {
            console.log("peerConnection:: connectionstatechange", peerConnection.connectionState);
            switch (peerConnection.connectionState) {
                case "connected":
                    setConnected(true);
                    setConnecting(false);
                    break;
                case "closed":
                case "disconnected":
                case "failed":
                    setConnected(false);
                    setConnecting(false);
                    onRefresh();
                    break;
            }
        });
        peerConnection.addEventListener("negotiationneeded", function (e) {
            console.log("peerConnection:: negotiationneeded");
            setNegotiationNeeded(true);
        });
        peerConnection.addEventListener("icecandidateerror", function (e) {
            // console.log('peerConnection:: icecandidateerror', e);
        });
        peerConnection.addEventListener("icecandidate", function (e) {
            console.log("peerConnection:: icecandidate", e.candidate);
            if (!e.candidate) {
                return;
            }
            //* trickle 상태를 유지하기 위해 곧바로 Customer에게 ice candidate 전달
            webRtcSocketRef.current.emit("candidate", {
                candidate: e.candidate,
                sender: userType,
            });
        });
        peerConnection.addEventListener("iceconnectionstatechange", function (e) {
            console.log("peerConnection:: iceconnectionstatechange", peerConnection.iceConnectionState);
        });
        peerConnection.addEventListener("icegatheringstatechange", function (e) {
            console.log("peerConnection:: icegatheringstatechange", peerConnection.iceGatheringState);
            switch (peerConnection.iceGatheringState) {
                case "complete":
                    setNegotiationNeeded(false);
                    console.log("peerConnection:: icegatheringstatechange", peerConnection.iceGatheringState, peerConnection.connectionState);
                    if (peerConnection.connectionState === "failed") {
                        onRefresh();
                    }
                    break;
            }
        });
        return peerConnection;
    };
    (0, react_1.useEffect)(function () {
        if (peerConnectionRef.current) {
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var s_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!navigator.mediaDevices) return [3 /*break*/, 2];
                            console.log("set local user media");
                            return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                    video: true,
                                    audio: true,
                                })];
                        case 1:
                            s_1 = _a.sent();
                            s_1.getTracks().forEach(function (track) {
                                if (track.kind === "video") {
                                    track.enabled = cameraOnYn;
                                }
                                else if (track.kind === "audio") {
                                    track.enabled = micOnYn;
                                }
                                console.log(track, localStreamRef.current);
                                peerConnectionRef.current.addTrack(track, localStreamRef.current);
                                localStreamRef.current.addTrack(track);
                            });
                            return [2 /*return*/, function () {
                                    s_1.getTracks().forEach(function (track) {
                                        track.stop();
                                    });
                                }];
                        case 2: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }, [peerConnectionRef.current, navigator.mediaDevices]);
    (0, react_1.useEffect)(function () {
        if (userType === 'DEALER' &&
            peerConnectionRef.current &&
            localStreamRef.current &&
            playerRef.current) {
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var s, newVideoTrack_1, videoSender;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!navigator.mediaDevices) return [3 /*break*/, 5];
                            // Hide the video element to prevent showing old stream briefly
                            playerRef.current.style.visibility = 'hidden';
                            // Check if the srcObject is an instance of MediaStream
                            if (playerRef.current.srcObject instanceof MediaStream) {
                                playerRef.current.srcObject
                                    .getVideoTracks()
                                    .forEach(function (track) { return track.stop(); });
                            }
                            console.log('screen sharing yn: ', screenSharingYn);
                            s = void 0;
                            if (!screenSharingYn) return [3 /*break*/, 2];
                            return [4 /*yield*/, navigator.mediaDevices.getDisplayMedia({
                                    video: true,
                                    audio: false,
                                })];
                        case 1:
                            s = _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            playerRef.current.style.opacity = '0';
                            if (!cameraOnYn) {
                                socketRef.current.emit('camera', {
                                    roomId: chatRoomId,
                                    sender: userType,
                                    onYn: false,
                                });
                            }
                            return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                    video: true,
                                    audio: false,
                                })];
                        case 3:
                            s = _a.sent();
                            playerRef.current.style.opacity = '1';
                            _a.label = 4;
                        case 4:
                            newVideoTrack_1 = s
                                .getVideoTracks()
                                .filter(function (i) { return i.readyState !== 'ended'; })[0];
                            newVideoTrack_1.onended = function (e) {
                                playerRef.current.style.opacity = '0';
                                if (playerRef.current.srcObject instanceof MediaStream) {
                                    playerRef.current.srcObject
                                        .getVideoTracks()
                                        .forEach(function (track) { return track.stop(); });
                                }
                                if (!cameraOnYn) {
                                    socketRef.current.emit('camera', {
                                        roomId: chatRoomId,
                                        sender: userType,
                                        onYn: false,
                                    });
                                }
                                playerRef.current.style.opacity = '1';
                                if (screenSharingYn)
                                    setScreenSharingYn(false);
                            };
                            videoSender = peerConnectionRef.current
                                .getSenders()
                                .filter(function (i) { var _a; return ((_a = i.track) === null || _a === void 0 ? void 0 : _a.kind) === 'video'; });
                            videoSender.forEach(function (sender) {
                                sender.replaceTrack(newVideoTrack_1);
                                if (screenSharingYn) {
                                    console.log('post send camera screenSharingYn', screenSharingYn);
                                    console.log('post send camera cameraOnYn', cameraOnYn);
                                    if (!cameraOnYn) {
                                        socketRef.current.emit('camera', {
                                            roomId: chatRoomId,
                                            sender: userType,
                                            onYn: true,
                                        });
                                    }
                                }
                                else {
                                    console.log('post send camera screenSharingYn', screenSharingYn);
                                    console.log('post send camera cameraOnYn', cameraOnYn);
                                    if (!cameraOnYn) {
                                        socketRef.current.emit('camera', {
                                            roomId: chatRoomId,
                                            sender: userType,
                                            onYn: false,
                                        });
                                    }
                                }
                            });
                            playerRef.current.srcObject = s;
                            // Make the video element visible again
                            playerRef.current.style.visibility = 'visible';
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); })();
            // return () => {
            //   s.getVideoTracks().forEach((track) => {
            //     track.stop();
            //   });
            // };
        }
    }, [screenSharingYn]);
    (0, react_1.useEffect)(function () {
        if (negotiationNeeded && peerJoinYn) {
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var sessionConstraints, offerDescription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(userType === "DEALER")) return [3 /*break*/, 3];
                            sessionConstraints = {
                                mandatory: {
                                    OfferToReceiveAudio: true,
                                    OfferToReceiveVideo: true,
                                },
                            };
                            return [4 /*yield*/, peerConnectionRef.current.createOffer(sessionConstraints)];
                        case 1:
                            offerDescription = _a.sent();
                            console.log("createoffer ~ offerDescription", offerDescription);
                            return [4 /*yield*/, peerConnectionRef.current.setLocalDescription(offerDescription)];
                        case 2:
                            _a.sent();
                            webRtcSocketRef.current.emit("offer", {
                                sdp: offerDescription,
                                sender: userType,
                            });
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }, [negotiationNeeded, peerJoinYn]);
    (0, react_1.useEffect)(function () {
        if (remoteStream && remotePlayerRef.current) {
            remotePlayerRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, remotePlayerRef.current]);
    (0, react_1.useEffect)(function () {
        localStreamRef.current
            .getVideoTracks()
            .forEach(function (track) { return (track.enabled = cameraOnYn); });
        console.log("send camera socket", cameraOnYn);
        socketRef.current.emit("camera", {
            roomId: chatRoomId,
            sender: userType,
            onYn: cameraOnYn,
        });
    }, [cameraOnYn]);
    (0, react_1.useEffect)(function () {
        localStreamRef.current
            .getAudioTracks()
            .forEach(function (track) { return (track.enabled = micOnYn); });
        socketRef.current.emit("microphone", {
            roomId: chatRoomId,
            sender: userType,
            onYn: micOnYn,
        });
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
        console.log(remoteStream);
        if (remoteStream) {
            if (((_a = remoteStream.getAudioTracks()) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                remoteStream.getAudioTracks()[0].enabled = customerMicOnYn;
                console.log("remote mic on? off? " + customerMicOnYn);
            }
        }
    }, [customerMicOnYn]);
    (0, react_1.useEffect)(function () {
        //* ice connection 상태가 completed 일 경우 remoteStream 설정
        if (connected) {
            console.log("completed!!");
            setStartTime(function (prev) { return prev || (0, moment_1.default)(); });
            socketRef.current.emit("microphone", {
                roomId: chatRoomId,
                sender: userType,
                onYn: micOnYn,
            });
            console.log("send connected camera socket", cameraOnYn);
            socketRef.current.emit("camera", {
                roomId: chatRoomId,
                sender: userType,
                onYn: cameraOnYn,
            });
        }
    }, [connected]);
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
    var allowChangeDevice = (0, react_1.useCallback)(function () {
        var _a;
        if (!socketRef.current)
            return alert("why");
        console.log(socketRef.current);
        (_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.emit("switchDevice", {
            roomId: chatRoomId,
            sender: userType,
            deviceType: "WEB",
            switchStatus: "ALLOW",
        });
        // allow 후 device switching = true
        setDeviceSwitchingYn(true);
        setDeviceSwitchRequested(false);
    }, [socketRef.current]);
    var rejectChangeDevice = (0, react_1.useCallback)(function () {
        var _a;
        (_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.emit("switchDevice", {
            roomId: chatRoomId,
            sender: userType,
            deviceType: "WEB",
            switchStatus: "REJECT",
        });
        //reject시 nothing
        setDeviceSwitchRequested(false);
    }, [socketRef.current]);
    var onRefresh = function () {
        var _a;
        console.log("refreshing start");
        (_a = peerConnectionRef.current) === null || _a === void 0 ? void 0 : _a.close();
        peerConnectionRef.current = initPeerConnection();
        setNetworkErrored(false);
    };
    var leaveSocket = (0, react_1.useCallback)(function () {
        var _a;
        console.log("leave");
        (_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.emit("leave", { roomId: chatRoomId, sender: userType });
        setLeftYn(true);
    }, [socketRef.current, chatRoomId]);
    var stop = (0, react_1.useCallback)(function (refreshing) {
        if (refreshing === void 0) { refreshing = false; }
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(function (mediaStream) {
            mediaStream.getTracks().forEach(function (track) {
                var _a;
                track.stop();
                (_a = localStreamRef.current) === null || _a === void 0 ? void 0 : _a.removeTrack(track);
                console.log("local track stopped");
            });
        });
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(function (track) {
                // track.stop();
                track.stop();
                localStreamRef.current.removeTrack(track);
            });
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
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
        setDeviceSwitchingYn(false);
        flushWebRTCSocket();
    }, [localStreamRef.current, peerConnectionRef.current, remoteStream]);
    var flushWebRTCSocket = function () {
        console.log('flush');
        var socket;
        var manager = new socket_io_client_1.Manager(SOCKET_URI, { transports: ['websocket'] });
        socket = manager.socket(SOCKET_NAMESPACE); // main namespace
        socket.off('getCandidate', getCandidate);
        socket.off('getAnswer', getAnswer);
        socket.off('all_users', allUsers);
        socket.disconnect();
    };
    var getCandidate = function (_a) {
        var candidate = _a.candidate, sender = _a.sender;
        var isMe = sender === 'DEALER';
        if (!isMe) {
            handleRemoteCandidate(candidate);
        }
    };
    var processCandidates = function () {
        if (remoteCandidates.length < 1) {
            return;
        }
        try {
            remoteCandidates.forEach(function (candidate) {
                if (candidate) {
                    peerConnectionRef.current.addIceCandidate(candidate);
                }
            });
            setRemoteCandidates([]);
        }
        catch (e) { }
    };
    var setRemoteDescription = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
        var answerDescription, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    answerDescription = new RTCSessionDescription(offer);
                    return [4 /*yield*/, peerConnectionRef.current.setRemoteDescription(answerDescription)];
                case 1:
                    _a.sent();
                    processCandidates();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error('setRemoteDescription ~ error ~', e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getAnswer = function (_a) {
        var sdp = _a.sdp, sender = _a.sender;
        return __awaiter(void 0, void 0, void 0, function () {
            var isMe;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isMe = sender === 'DEALER';
                        if (!!isMe) return [3 /*break*/, 2];
                        return [4 /*yield*/, setRemoteDescription(sdp)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    var allUsers = function (all_users) { return __awaiter(void 0, void 0, void 0, function () {
        var users, len;
        return __generator(this, function (_a) {
            users = all_users.filter(function (i) { return i.sender !== 'DEALER'; });
            len = users.length;
            //* room에 두명 이상 있을 시 handshake 로직 시작
            if (len > 0) {
                // await sendOffer();
                setPeerJoinYn(true);
            }
            return [2 /*return*/];
        });
    }); };
    var handleRemoteCandidate = function (iceCandidate) {
        var _a;
        try {
            var newCandidate = new RTCIceCandidate(iceCandidate);
            if (peerConnectionRef.current === null ||
                ((_a = peerConnectionRef.current) === null || _a === void 0 ? void 0 : _a.remoteDescription) == null) {
                remoteCandidates.push(newCandidate);
            }
            else {
                if (newCandidate) {
                    peerConnectionRef.current.addIceCandidate(newCandidate);
                }
            }
        }
        catch (e) { }
    };
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
        deviceChangeStartYn: deviceChangeStartYn,
        deviceSwitchingYn: deviceSwitchingYn,
        deviceSwitchRequested: deviceSwitchRequested,
        deviceSwitchSucceeded: deviceSwitchSucceeded,
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
        deviceChangeStartYn,
        deviceSwitchingYn,
        deviceSwitchRequested,
        deviceSwitchSucceeded,
    ]);
    var stream = (0, react_1.useMemo)(function () {
        return { localStream: localStreamRef.current, remoteStream: remoteStream };
    }, [localStreamRef.current, remoteStream]);
    var sockets = (0, react_1.useMemo)(function () {
        return socketRef.current;
    }, [socketRef.current]);
    return {
        mediaStatus: mediaStatus,
        connectStatus: connectStatus,
        stream: stream,
        setCameraOnYn: setCameraOnYn,
        setMicOnYn: setMicOnYn,
        setScreenSharingYn: setScreenSharingYn,
        setDeviceChangeStartYn: setDeviceChangeStartYn,
        onStop: stop,
        onStart: function () { },
        onAllowDeviceChange: allowChangeDevice,
        onRejectDeviceChange: rejectChangeDevice,
        leaveSocket: leaveSocket,
        onRefresh: onRefresh,
        socketInstance: sockets,
        setDeviceSwitchRequested: setDeviceSwitchRequested,
        setDeviceSwitchSucceeded: setDeviceSwitchSucceeded,
        setDeviceSwitchingYn: setDeviceSwitchingYn,
        player: {
            playerRef: playerRef,
            remotePlayerRef: remotePlayerRef,
        },
    };
};
exports.default = Rtc;
