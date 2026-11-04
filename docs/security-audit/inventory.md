# Inventario de dependencias y avisos

Generado desde audit-before.json, audit-after.json, tree-before.json y package-lock.json. Los rangos de la columna afectada son los del advisory, no versiones inferidas. Los paquetes propagados se separan de los avisos únicos.

| Paquete | Instalado antes | Lock final | Severidad inicial por paquete | Aviso final |
| --- | --- | --- | --- | --- |
| @typescript-eslint/eslint-plugin | 8.57.2 | 8.57.2 | moderate | moderate |
| @typescript-eslint/parser | 8.57.2 | 8.57.2 | moderate | moderate |
| @typescript-eslint/type-utils | 8.57.2 | 8.57.2 | moderate | moderate |
| @typescript-eslint/typescript-estree | 8.57.2 | 8.57.2 | moderate | moderate |
| @typescript-eslint/utils | 8.57.2 | 8.57.2 | moderate | moderate |
| brace-expansion | 1.1.18, 5.0.9 | 1.1.21, 5.0.12 | high | No aparece |
| eslint-config-next | 16.2.1 | 16.4.5 | moderate | moderate |
| minimatch | 10.2.4, 3.1.5 | 10.2.4, 3.1.5 | moderate | moderate |
| next | 16.3.4 | 16.4.5 | critical | No aparece |
| nodemailer | 9.1.1 | 10.3.1 | high | No aparece |
| sharp | 0.35.4 | 0.35.5 | high | No aparece |
| source-map-js | 1.2.1 | 1.2.2 | high | No aparece |
| typescript-eslint | 8.57.2 | 8.57.2 | moderate | moderate |
| zod | 4.3.6 | 4.6.7 | high | No aparece |

## Avisos únicos

| Paquete | Identificador oficial | Severidad | Rango afectado | Estado según auditoría final |
| --- | --- | --- | --- | --- |
| brace-expansion | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | moderate | <1.1.21 | Fuera del árbol afectado |
| brace-expansion | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | moderate | >=4.0.0 <5.0.12 | Fuera del árbol afectado |
| brace-expansion | [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | high | <1.1.20 | Fuera del árbol afectado |
| brace-expansion | [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | high | >=4.0.0 <5.0.11 | Fuera del árbol afectado |
| brace-expansion | [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | high | <1.1.19 | Fuera del árbol afectado |
| brace-expansion | [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | high | >=4.0.0 <5.0.10 | Fuera del árbol afectado |
| minimatch | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | moderate | >=7.0.0 <11.0.1 | Pendiente, ver informe |
| next | [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) | critical | >=16.2.0 <16.3.6 | Fuera del árbol afectado |
| next | [GHSA-3w37-wq28-93x7](https://github.com/advisories/GHSA-3w37-wq28-93x7) | moderate | >=16.3.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) | moderate | >=16.0.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-39w2-rjm5-chcv](https://github.com/advisories/GHSA-39w2-rjm5-chcv) | low | >=16.0.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-f87g-xv8r-7p7x](https://github.com/advisories/GHSA-f87g-xv8r-7p7x) | moderate | >=16.0.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p) | moderate | >=16.0.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) | high | >=16.0.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) | critical | >=16.0.0 <=16.4.0 | Fuera del árbol afectado |
| next | [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) | high | >=16.0.0 <=16.4.0 | Fuera del árbol afectado |
| next | [GHSA-h694-7cp9-m8p3](https://github.com/advisories/GHSA-h694-7cp9-m8p3) | moderate | >=16.3.0 <16.3.8 | Fuera del árbol afectado |
| next | [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr) | critical | >=16.0.0 <=16.4.0 | Fuera del árbol afectado |
| nodemailer | [GHSA-6vj9-mwq6-2f5v](https://github.com/advisories/GHSA-6vj9-mwq6-2f5v) | moderate | >=5.0.0 <10.0.2 | Fuera del árbol afectado |
| nodemailer | [GHSA-8vvx-rff5-p5rq](https://github.com/advisories/GHSA-8vvx-rff5-p5rq) | moderate | <10.0.2 | Fuera del árbol afectado |
| nodemailer | [GHSA-g57g-f23g-4646](https://github.com/advisories/GHSA-g57g-f23g-4646) | moderate | >=9.1.0 <10.0.9 | Fuera del árbol afectado |
| nodemailer | [GHSA-v53p-9fqp-m79j](https://github.com/advisories/GHSA-v53p-9fqp-m79j) | high | <=10.0.5 | Fuera del árbol afectado |
| nodemailer | [GHSA-prgh-xp8r-p3m5](https://github.com/advisories/GHSA-prgh-xp8r-p3m5) | high | >=9.1.0 <=10.0.4 | Fuera del árbol afectado |
| nodemailer | [GHSA-39m8-27wv-hr27](https://github.com/advisories/GHSA-39m8-27wv-hr27) | moderate | >=3.0.0 <=10.0.9 | Fuera del árbol afectado |
| nodemailer | [GHSA-8c8m-p3m8-cjg8](https://github.com/advisories/GHSA-8c8m-p3m8-cjg8) | moderate | >=3.0.0 <10.1.4 | Fuera del árbol afectado |
| nodemailer | [GHSA-m943-m63m-w62w](https://github.com/advisories/GHSA-m943-m63m-w62w) | moderate | >=3.0.0 <10.1.4 | Fuera del árbol afectado |
| nodemailer | [GHSA-85x2-q946-cp5h](https://github.com/advisories/GHSA-85x2-q946-cp5h) | moderate | >=3.0.0 <10.1.4 | Fuera del árbol afectado |
| nodemailer | [GHSA-4ffr-jq9g-5ffx](https://github.com/advisories/GHSA-4ffr-jq9g-5ffx) | moderate | >=3.0.0 <=10.0.12 | Fuera del árbol afectado |
| nodemailer | [GHSA-g73g-hqqh-jr95](https://github.com/advisories/GHSA-g73g-hqqh-jr95) | moderate | >=3.0.0 <=10.0.12 | Fuera del árbol afectado |
| nodemailer | [GHSA-4g23-2xm8-66gc](https://github.com/advisories/GHSA-4g23-2xm8-66gc) | moderate | >=3.0.0 <=10.0.9 | Fuera del árbol afectado |
| sharp | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | high | <0.35.5 | Fuera del árbol afectado |
| source-map-js | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | high | >=1.0.0 <1.2.2 | Fuera del árbol afectado |
| zod | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | high | <4.6.6 | Fuera del árbol afectado |

## Resultado npm

```json
{
  "before": {
    "info": 0,
    "low": 0,
    "moderate": 8,
    "high": 5,
    "critical": 1,
    "total": 14
  },
  "after": {
    "info": 0,
    "low": 0,
    "moderate": 8,
    "high": 0,
    "critical": 0,
    "total": 8
  }
}
```
