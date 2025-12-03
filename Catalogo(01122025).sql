--
-- PostgreSQL database dump
--

\restrict qPNicwbgkPb222uKnvClqvcnk4GfN1w90Kbym3FAqgRfVeWTFnLu4yTT0vebUfb

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-01 18:09:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: Articulos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Articulos" (
    "IdArticulo" integer NOT NULL,
    "CodArticulo" character varying(50) NOT NULL,
    "NomArticulo" character varying(150) NOT NULL,
    "StockActual" integer DEFAULT 0,
    "IdProveedor" integer,
    "IdCfgStock" integer NOT NULL,
    "BajaLogica" boolean DEFAULT true,
    "FechaAlta" timestamp without time zone DEFAULT now(),
    "FechaUltMod" timestamp without time zone DEFAULT now(),
    "ClaUserMod" integer,
    "NombrePcMod" character varying(100),
    "IdUsuarioCreacion" integer,
    "FechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "IdUsuarioModificacion" integer,
    "FechaModificacion" timestamp without time zone,
    "PrecioVenta" numeric(10,2) DEFAULT 0 NOT NULL,
    "CostoPromedio" numeric(10,2) DEFAULT 0
);


ALTER TABLE public."Articulos" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: Articulos_IdArticulo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Articulos_IdArticulo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Articulos_IdArticulo_seq" OWNER TO postgres;

--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 220
-- Name: Articulos_IdArticulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Articulos_IdArticulo_seq" OWNED BY public."Articulos"."IdArticulo";


--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: CfgStock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CfgStock" (
    "IdCfgStock" integer NOT NULL,
    "CantidadMaxima" integer NOT NULL,
    "CantidadMinima" integer NOT NULL,
    "BajaLogica" boolean DEFAULT true,
    "FechaAlta" timestamp without time zone DEFAULT now(),
    "FechaUltMod" timestamp without time zone DEFAULT now(),
    "ClaUserMod" integer,
    "NombrePcMod" character varying(100)
);


ALTER TABLE public."CfgStock" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16410)
-- Name: CfgStock_IdCfgStock_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CfgStock_IdCfgStock_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CfgStock_IdCfgStock_seq" OWNER TO postgres;

--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 222
-- Name: CfgStock_IdCfgStock_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CfgStock_IdCfgStock_seq" OWNED BY public."CfgStock"."IdCfgStock";


--
-- TOC entry 236 (class 1259 OID 16576)
-- Name: Combos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Combos" (
    "IdCombo" integer NOT NULL,
    "Nombre" character varying(100) NOT NULL,
    "Codigo" character varying(50),
    "Precio" numeric(10,2) NOT NULL,
    "Activo" boolean DEFAULT true,
    "IdUsuarioCreacion" integer,
    "FechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "IdUsuarioModificacion" integer,
    "FechaModificacion" timestamp without time zone
);


ALTER TABLE public."Combos" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16575)
-- Name: Combos_IdCombo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Combos_IdCombo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Combos_IdCombo_seq" OWNER TO postgres;

--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 235
-- Name: Combos_IdCombo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Combos_IdCombo_seq" OWNED BY public."Combos"."IdCombo";


--
-- TOC entry 238 (class 1259 OID 16587)
-- Name: DetalleCombos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DetalleCombos" (
    "IdDetalleCombo" integer NOT NULL,
    "IdCombo" integer,
    "IdArticulo" integer,
    "Cantidad" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."DetalleCombos" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16586)
-- Name: DetalleCombos_IdDetalleCombo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DetalleCombos_IdDetalleCombo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DetalleCombos_IdDetalleCombo_seq" OWNER TO postgres;

--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 237
-- Name: DetalleCombos_IdDetalleCombo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DetalleCombos_IdDetalleCombo_seq" OWNED BY public."DetalleCombos"."IdDetalleCombo";


--
-- TOC entry 242 (class 1259 OID 16707)
-- Name: DetalleEntradas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DetalleEntradas" (
    "IdDetalleEntrada" integer NOT NULL,
    "IdEntrada" integer,
    "IdArticulo" integer,
    "Cantidad" integer NOT NULL,
    "CostoUnitario" numeric(10,2) NOT NULL,
    "Subtotal" numeric(10,2) NOT NULL
);


ALTER TABLE public."DetalleEntradas" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16706)
-- Name: DetalleEntradas_IdDetalleEntrada_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DetalleEntradas_IdDetalleEntrada_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DetalleEntradas_IdDetalleEntrada_seq" OWNER TO postgres;

--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 241
-- Name: DetalleEntradas_IdDetalleEntrada_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DetalleEntradas_IdDetalleEntrada_seq" OWNED BY public."DetalleEntradas"."IdDetalleEntrada";


--
-- TOC entry 234 (class 1259 OID 16555)
-- Name: DetalleVentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DetalleVentas" (
    "IdDetalle" integer NOT NULL,
    "IdVenta" integer,
    "IdArticulo" integer,
    "Cantidad" integer NOT NULL,
    "PrecioUnitario" numeric(10,2) NOT NULL,
    "Subtotal" numeric(10,2) NOT NULL,
    "IdCombo" integer
);


ALTER TABLE public."DetalleVentas" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16554)
-- Name: DetalleVentas_IdDetalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DetalleVentas_IdDetalle_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DetalleVentas_IdDetalle_seq" OWNER TO postgres;

--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 233
-- Name: DetalleVentas_IdDetalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DetalleVentas_IdDetalle_seq" OWNED BY public."DetalleVentas"."IdDetalle";


--
-- TOC entry 240 (class 1259 OID 16684)
-- Name: Entradas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Entradas" (
    "IdEntrada" integer NOT NULL,
    "IdProveedor" integer,
    "Fecha" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "Total" numeric(10,2) NOT NULL,
    "Comentarios" text,
    "IdUsuarioCreacion" integer,
    "FechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Entradas" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16683)
-- Name: Entradas_IdEntrada_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Entradas_IdEntrada_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Entradas_IdEntrada_seq" OWNER TO postgres;

--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 239
-- Name: Entradas_IdEntrada_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Entradas_IdEntrada_seq" OWNED BY public."Entradas"."IdEntrada";


--
-- TOC entry 223 (class 1259 OID 16423)
-- Name: Proveedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Proveedores" (
    "IdProveedor" integer NOT NULL,
    "NomProveedor" character varying(100) NOT NULL,
    "RFC" character varying(20),
    "BajaLogica" boolean DEFAULT true,
    "FechaUltMod" timestamp without time zone DEFAULT now(),
    "ClaUserMod" integer,
    "NombrePcMod" character varying(100),
    "IdUsuarioCreacion" integer,
    "FechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "IdUsuarioModificacion" integer,
    "FechaModificacion" timestamp without time zone
);


ALTER TABLE public."Proveedores" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16430)
-- Name: Proveedores_IdProveedor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Proveedores_IdProveedor_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Proveedores_IdProveedor_seq" OWNER TO postgres;

--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 224
-- Name: Proveedores_IdProveedor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Proveedores_IdProveedor_seq" OWNED BY public."Proveedores"."IdProveedor";


--
-- TOC entry 225 (class 1259 OID 16431)
-- Name: Salidas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Salidas" (
    "IdSalida" integer NOT NULL,
    "IdArticulo" integer NOT NULL,
    "Cantidad" integer NOT NULL,
    "Comentarios" text,
    "FechaMovimiento" timestamp without time zone DEFAULT now(),
    "BajaLogica" boolean DEFAULT true,
    "FechaUltMod" timestamp without time zone DEFAULT now(),
    "ClaUserMod" integer,
    "NombrePcMod" character varying(100)
);


ALTER TABLE public."Salidas" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16442)
-- Name: Salidas_IdSalida_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Salidas_IdSalida_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Salidas_IdSalida_seq" OWNER TO postgres;

--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 226
-- Name: Salidas_IdSalida_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Salidas_IdSalida_seq" OWNED BY public."Salidas"."IdSalida";


--
-- TOC entry 227 (class 1259 OID 16443)
-- Name: Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuario" (
    "IdUsuario" integer NOT NULL,
    "Nombre" character varying(100) NOT NULL,
    "Email" character varying(100) NOT NULL,
    "PasswordHash" character varying(255) NOT NULL,
    "Rol" character varying(50) DEFAULT 'USER'::character varying,
    "BajaLogica" boolean DEFAULT true,
    "FechaUltMod" timestamp without time zone DEFAULT now(),
    "ClaUserMod" integer,
    "NombrePcMod" character varying(100),
    "IdUsuarioCreacion" integer,
    "FechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "IdUsuarioModificacion" integer,
    "FechaModificacion" timestamp without time zone
);


ALTER TABLE public."Usuario" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16455)
-- Name: Usuario_IdUsuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuario_IdUsuario_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_IdUsuario_seq" OWNER TO postgres;

--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 228
-- Name: Usuario_IdUsuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuario_IdUsuario_seq" OWNED BY public."Usuario"."IdUsuario";


--
-- TOC entry 232 (class 1259 OID 16539)
-- Name: Ventas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ventas" (
    "IdVenta" integer NOT NULL,
    "Fecha" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "Total" numeric(10,2) NOT NULL,
    "IdUsuario" integer,
    "Estado" character varying(20) DEFAULT 'COMPLETADA'::character varying
);


ALTER TABLE public."Ventas" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16538)
-- Name: Ventas_IdVenta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Ventas_IdVenta_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Ventas_IdVenta_seq" OWNER TO postgres;

--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 231
-- Name: Ventas_IdVenta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Ventas_IdVenta_seq" OWNED BY public."Ventas"."IdVenta";


--
-- TOC entry 230 (class 1259 OID 16522)
-- Name: bitacora_actividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bitacora_actividades (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(255) NOT NULL,
    detalles text,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bitacora_actividades OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16521)
-- Name: bitacora_actividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bitacora_actividades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bitacora_actividades_id_seq OWNER TO postgres;

--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 229
-- Name: bitacora_actividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bitacora_actividades_id_seq OWNED BY public.bitacora_actividades.id;


--
-- TOC entry 4911 (class 2604 OID 16515)
-- Name: Articulos IdArticulo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos" ALTER COLUMN "IdArticulo" SET DEFAULT nextval('public."Articulos_IdArticulo_seq"'::regclass);


--
-- TOC entry 4919 (class 2604 OID 16516)
-- Name: CfgStock IdCfgStock; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CfgStock" ALTER COLUMN "IdCfgStock" SET DEFAULT nextval('public."CfgStock_IdCfgStock_seq"'::regclass);


--
-- TOC entry 4942 (class 2604 OID 16579)
-- Name: Combos IdCombo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Combos" ALTER COLUMN "IdCombo" SET DEFAULT nextval('public."Combos_IdCombo_seq"'::regclass);


--
-- TOC entry 4945 (class 2604 OID 16590)
-- Name: DetalleCombos IdDetalleCombo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCombos" ALTER COLUMN "IdDetalleCombo" SET DEFAULT nextval('public."DetalleCombos_IdDetalleCombo_seq"'::regclass);


--
-- TOC entry 4950 (class 2604 OID 16710)
-- Name: DetalleEntradas IdDetalleEntrada; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleEntradas" ALTER COLUMN "IdDetalleEntrada" SET DEFAULT nextval('public."DetalleEntradas_IdDetalleEntrada_seq"'::regclass);


--
-- TOC entry 4941 (class 2604 OID 16558)
-- Name: DetalleVentas IdDetalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas" ALTER COLUMN "IdDetalle" SET DEFAULT nextval('public."DetalleVentas_IdDetalle_seq"'::regclass);


--
-- TOC entry 4947 (class 2604 OID 16687)
-- Name: Entradas IdEntrada; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entradas" ALTER COLUMN "IdEntrada" SET DEFAULT nextval('public."Entradas_IdEntrada_seq"'::regclass);


--
-- TOC entry 4923 (class 2604 OID 16518)
-- Name: Proveedores IdProveedor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedores" ALTER COLUMN "IdProveedor" SET DEFAULT nextval('public."Proveedores_IdProveedor_seq"'::regclass);


--
-- TOC entry 4927 (class 2604 OID 16519)
-- Name: Salidas IdSalida; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salidas" ALTER COLUMN "IdSalida" SET DEFAULT nextval('public."Salidas_IdSalida_seq"'::regclass);


--
-- TOC entry 4931 (class 2604 OID 16520)
-- Name: Usuario IdUsuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN "IdUsuario" SET DEFAULT nextval('public."Usuario_IdUsuario_seq"'::regclass);


--
-- TOC entry 4938 (class 2604 OID 16542)
-- Name: Ventas IdVenta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas" ALTER COLUMN "IdVenta" SET DEFAULT nextval('public."Ventas_IdVenta_seq"'::regclass);


--
-- TOC entry 4936 (class 2604 OID 16525)
-- Name: bitacora_actividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora_actividades ALTER COLUMN id SET DEFAULT nextval('public.bitacora_actividades_id_seq'::regclass);


--
-- TOC entry 5152 (class 0 OID 16389)
-- Dependencies: 219
-- Data for Name: Articulos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Articulos" ("IdArticulo", "CodArticulo", "NomArticulo", "StockActual", "IdProveedor", "IdCfgStock", "BajaLogica", "FechaAlta", "FechaUltMod", "ClaUserMod", "NombrePcMod", "IdUsuarioCreacion", "FechaCreacion", "IdUsuarioModificacion", "FechaModificacion", "PrecioVenta", "CostoPromedio") FROM stdin;
2	CLV-001	Clavos 1/4	0	1	2	t	2025-09-29 18:05:27.347125	2025-09-29 18:07:34.355174	3	WEB_APP	\N	2025-11-26 10:27:08.003785	\N	\N	0.00	0.00
3	TBL-0004	Tabla roca	5	1	3	t	2025-09-29 18:24:23.702177	2025-09-29 20:01:01.801483	3	WEB_APP	\N	2025-11-26 10:27:08.003785	\N	\N	0.00	0.00
4	LP-004	Lampara	99	3	4	f	2025-09-29 19:12:56.341398	2025-11-21 11:32:42.755916	4	WEB_APP	\N	2025-11-26 10:27:08.003785	4	2025-12-01 17:54:55.16428	25.00	0.00
6	NUEVO-008	Oso	3	3	6	f	2025-09-29 19:54:40.162427	2025-09-29 19:55:26.045424	3	WEB_APP_MOV	\N	2025-11-26 10:27:08.003785	4	2025-12-01 17:55:54.649965	50.00	0.00
1	LAP-X200	Laptop X200 - Modelo 2024	10	3	1	f	2025-09-29 16:04:04.780346	2025-11-21 11:32:53.435869	4	WEB_APP	\N	2025-11-26 10:27:08.003785	4	2025-12-01 17:55:17.190509	2050.00	0.00
5	LOP-009	Loseta modelo cajeta	8	3	5	f	2025-09-29 19:33:29.662465	2025-09-29 19:54:57.589164	3	WEB_APP_MOV	\N	2025-11-26 10:27:08.003785	4	2025-12-01 17:55:37.81255	20.00	0.00
\.


--
-- TOC entry 5154 (class 0 OID 16401)
-- Dependencies: 221
-- Data for Name: CfgStock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CfgStock" ("IdCfgStock", "CantidadMaxima", "CantidadMinima", "BajaLogica", "FechaAlta", "FechaUltMod", "ClaUserMod", "NombrePcMod") FROM stdin;
2	150	10	t	2025-09-29 18:05:27.347125	2025-09-29 18:07:28.695	3	WEB_APP
3	200	10	t	2025-09-29 18:24:23.702177	2025-09-29 18:24:23.702177	3	WEB_APP
4	100	5	t	2025-09-29 19:12:56.341398	2025-11-21 11:32:42.755916	4	WEB_APP
1	150	5	t	2025-09-29 16:04:04.780346	2025-11-21 11:32:53.435869	4	WEB_APP
5	300	10	t	2025-09-29 19:33:29.662465	2025-09-29 19:33:29.662465	3	WEB_APP
6	300	10	t	2025-09-29 19:54:40.162427	2025-09-29 19:54:40.162427	3	WEB_APP
\.


--
-- TOC entry 5169 (class 0 OID 16576)
-- Dependencies: 236
-- Data for Name: Combos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Combos" ("IdCombo", "Nombre", "Codigo", "Precio", "Activo", "IdUsuarioCreacion", "FechaCreacion", "IdUsuarioModificacion", "FechaModificacion") FROM stdin;
1	Combo Home Office	C-001	500.00	t	\N	2025-11-26 10:27:08.003785	4	2025-12-01 13:51:07.033136
2	Kit de prueba	KIT-1154	300.00	t	4	2025-12-01 16:11:43.417194	\N	\N
\.


--
-- TOC entry 5171 (class 0 OID 16587)
-- Dependencies: 238
-- Data for Name: DetalleCombos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DetalleCombos" ("IdDetalleCombo", "IdCombo", "IdArticulo", "Cantidad") FROM stdin;
4	1	4	1
5	1	1	1
6	2	4	1
7	2	5	1
8	2	6	5
\.


--
-- TOC entry 5175 (class 0 OID 16707)
-- Dependencies: 242
-- Data for Name: DetalleEntradas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DetalleEntradas" ("IdDetalleEntrada", "IdEntrada", "IdArticulo", "Cantidad", "CostoUnitario", "Subtotal") FROM stdin;
1	1	4	2	50.00	100.00
2	1	5	4	10.00	40.00
\.


--
-- TOC entry 5167 (class 0 OID 16555)
-- Dependencies: 234
-- Data for Name: DetalleVentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DetalleVentas" ("IdDetalle", "IdVenta", "IdArticulo", "Cantidad", "PrecioUnitario", "Subtotal", "IdCombo") FROM stdin;
1	2	4	2	150.00	300.00	\N
2	3	1	1	150.00	150.00	\N
3	3	5	5	150.00	750.00	\N
4	3	6	1	150.00	150.00	\N
5	4	6	2	150.00	300.00	\N
6	4	1	1	150.00	150.00	\N
7	4	4	1	150.00	150.00	\N
8	5	\N	1	500.00	500.00	1
9	5	4	1	150.00	150.00	\N
10	6	\N	1	500.00	500.00	1
11	6	4	2	150.00	300.00	\N
12	6	1	1	150.00	150.00	\N
13	7	4	1	150.00	150.00	\N
14	7	\N	1	500.00	500.00	1
15	8	\N	1	300.00	300.00	2
16	9	1	1	150.00	150.00	\N
17	10	1	1	2050.00	2050.00	\N
18	10	5	1	20.00	20.00	\N
\.


--
-- TOC entry 5173 (class 0 OID 16684)
-- Dependencies: 240
-- Data for Name: Entradas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Entradas" ("IdEntrada", "IdProveedor", "Fecha", "Total", "Comentarios", "IdUsuarioCreacion", "FechaCreacion") FROM stdin;
1	3	2025-11-28 08:57:35.154437	140.00	Prueba	4	2025-11-28 08:57:35.154437
\.


--
-- TOC entry 5156 (class 0 OID 16423)
-- Dependencies: 223
-- Data for Name: Proveedores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Proveedores" ("IdProveedor", "NomProveedor", "RFC", "BajaLogica", "FechaUltMod", "ClaUserMod", "NombrePcMod", "IdUsuarioCreacion", "FechaCreacion", "IdUsuarioModificacion", "FechaModificacion") FROM stdin;
1	Proveedor Genérico	GEN000101XYZ	t	2025-09-29 15:45:30.724392	0	SETUP_SCRIPT	\N	2025-11-26 10:27:08.003785	\N	\N
2	Proveedor Genial	RFCINVENTADO	t	2025-09-29 19:53:56.076886	\N	\N	\N	2025-11-26 10:27:08.003785	\N	\N
3	Pepsi	PEP123	f	2025-11-25 15:11:33.1494	\N	\N	\N	2025-11-26 10:27:08.003785	\N	\N
\.


--
-- TOC entry 5158 (class 0 OID 16431)
-- Dependencies: 225
-- Data for Name: Salidas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Salidas" ("IdSalida", "IdArticulo", "Cantidad", "Comentarios", "FechaMovimiento", "BajaLogica", "FechaUltMod", "ClaUserMod", "NombrePcMod") FROM stdin;
1	1	45	Salida a producción	2025-09-29 16:30:55.129055	t	2025-09-29 16:30:55.129055	3	WEB_APP_MOV
2	1	5	Venta	2025-09-29 18:34:01.720781	t	2025-09-29 18:34:01.720781	3	WEB_APP_MOV
3	3	40	Movimiento SALIDA	2025-09-29 18:38:36.377221	t	2025-09-29 18:38:36.377221	3	WEB_APP_MOV
4	1	20	Movimiento SALIDA	2025-09-29 18:38:53.931307	t	2025-09-29 18:38:53.931307	3	WEB_APP_MOV
5	3	5	venta	2025-09-29 19:02:02.692499	t	2025-09-29 19:02:02.692499	3	WEB_APP_MOV
6	1	5	venta	2025-09-29 19:13:27.559935	t	2025-09-29 19:13:27.559935	3	WEB_APP_MOV
\.


--
-- TOC entry 5160 (class 0 OID 16443)
-- Dependencies: 227
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" ("IdUsuario", "Nombre", "Email", "PasswordHash", "Rol", "BajaLogica", "FechaUltMod", "ClaUserMod", "NombrePcMod", "IdUsuarioCreacion", "FechaCreacion", "IdUsuarioModificacion", "FechaModificacion") FROM stdin;
3	Admin Catalogo	admin@catalogo.com	$2b$10$R5FaFwEkIBpjXKsryfaUD.0PfNYF3Az0K/CzBWwZe7.bZr44dS17O	ADMIN	f	2025-09-29 15:49:46.683431	1	SERVIDOR_REG	\N	2025-11-26 10:27:08.003785	\N	\N
4	Fernando Admin	fernando@test.com	$2b$10$V7HDfI/NRvRg9T3tr8Mku.0clGYWKsMNTmKCDXDl6uRaIN5fEraX2	ADMIN	f	2025-11-21 11:28:20.030887	1	SERVIDOR_REG	\N	2025-11-26 10:27:08.003785	\N	\N
5	Pedro Almacen	pedro@test.com	$2b$10$QxRuSrfalYW57ME5bPG/hO3574TNK32XsTrvDI/Kdi7N0wPIKZ106	ALMACEN	t	2025-11-24 11:35:57.711251	\N	\N	\N	2025-11-26 10:27:08.003785	\N	\N
6	Ejemplo Algo	ejemplo@correo.com	$2b$10$b4PeX2YWYgB4t82r9a9BB.bbSrxnV4EwpxCadLr9D0QMNelUifUK2	VENDEDOR	f	2025-11-24 12:35:45.365331	\N	\N	\N	2025-11-26 10:27:08.003785	\N	\N
\.


--
-- TOC entry 5165 (class 0 OID 16539)
-- Dependencies: 232
-- Data for Name: Ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ventas" ("IdVenta", "Fecha", "Total", "IdUsuario", "Estado") FROM stdin;
2	2025-11-24 13:56:05.134674	300.00	4	COMPLETADA
3	2025-11-24 16:23:15.093227	1050.00	\N	COMPLETADA
4	2025-11-25 09:48:32.848748	600.00	\N	COMPLETADA
5	2025-11-25 13:38:41.532084	650.00	\N	COMPLETADA
6	2025-11-25 13:50:22.319847	950.00	\N	COMPLETADA
7	2025-11-25 14:42:12.529143	650.00	\N	COMPLETADA
8	2025-12-01 16:11:58.573514	300.00	4	COMPLETADA
9	2025-12-01 16:39:09.423773	150.00	4	COMPLETADA
10	2025-12-01 18:02:18.555247	2070.00	4	COMPLETADA
\.


--
-- TOC entry 5163 (class 0 OID 16522)
-- Dependencies: 230
-- Data for Name: bitacora_actividades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bitacora_actividades (id, usuario_id, accion, detalles, fecha) FROM stdin;
\.


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 220
-- Name: Articulos_IdArticulo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Articulos_IdArticulo_seq"', 6, true);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 222
-- Name: CfgStock_IdCfgStock_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CfgStock_IdCfgStock_seq"', 6, true);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 235
-- Name: Combos_IdCombo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Combos_IdCombo_seq"', 2, true);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 237
-- Name: DetalleCombos_IdDetalleCombo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DetalleCombos_IdDetalleCombo_seq"', 8, true);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 241
-- Name: DetalleEntradas_IdDetalleEntrada_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DetalleEntradas_IdDetalleEntrada_seq"', 2, true);


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 233
-- Name: DetalleVentas_IdDetalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DetalleVentas_IdDetalle_seq"', 18, true);


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 239
-- Name: Entradas_IdEntrada_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Entradas_IdEntrada_seq"', 1, true);


--
-- TOC entry 5200 (class 0 OID 0)
-- Dependencies: 224
-- Name: Proveedores_IdProveedor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Proveedores_IdProveedor_seq"', 3, true);


--
-- TOC entry 5201 (class 0 OID 0)
-- Dependencies: 226
-- Name: Salidas_IdSalida_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Salidas_IdSalida_seq"', 6, true);


--
-- TOC entry 5202 (class 0 OID 0)
-- Dependencies: 228
-- Name: Usuario_IdUsuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_IdUsuario_seq"', 6, true);


--
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 231
-- Name: Ventas_IdVenta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Ventas_IdVenta_seq"', 10, true);


--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 229
-- Name: bitacora_actividades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bitacora_actividades_id_seq', 1, false);


--
-- TOC entry 4952 (class 2606 OID 16463)
-- Name: Articulos Articulos_CodArticulo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_CodArticulo_key" UNIQUE ("CodArticulo");


--
-- TOC entry 4954 (class 2606 OID 16465)
-- Name: Articulos Articulos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_pkey" PRIMARY KEY ("IdArticulo");


--
-- TOC entry 4956 (class 2606 OID 16467)
-- Name: CfgStock CfgStock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CfgStock"
    ADD CONSTRAINT "CfgStock_pkey" PRIMARY KEY ("IdCfgStock");


--
-- TOC entry 4974 (class 2606 OID 16585)
-- Name: Combos Combos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Combos"
    ADD CONSTRAINT "Combos_pkey" PRIMARY KEY ("IdCombo");


--
-- TOC entry 4976 (class 2606 OID 16595)
-- Name: DetalleCombos DetalleCombos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCombos"
    ADD CONSTRAINT "DetalleCombos_pkey" PRIMARY KEY ("IdDetalleCombo");


--
-- TOC entry 4980 (class 2606 OID 16716)
-- Name: DetalleEntradas DetalleEntradas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleEntradas"
    ADD CONSTRAINT "DetalleEntradas_pkey" PRIMARY KEY ("IdDetalleEntrada");


--
-- TOC entry 4972 (class 2606 OID 16564)
-- Name: DetalleVentas DetalleVentas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT "DetalleVentas_pkey" PRIMARY KEY ("IdDetalle");


--
-- TOC entry 4978 (class 2606 OID 16695)
-- Name: Entradas Entradas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entradas"
    ADD CONSTRAINT "Entradas_pkey" PRIMARY KEY ("IdEntrada");


--
-- TOC entry 4958 (class 2606 OID 16471)
-- Name: Proveedores Proveedores_RFC_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedores"
    ADD CONSTRAINT "Proveedores_RFC_key" UNIQUE ("RFC");


--
-- TOC entry 4960 (class 2606 OID 16473)
-- Name: Proveedores Proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedores"
    ADD CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("IdProveedor");


--
-- TOC entry 4962 (class 2606 OID 16475)
-- Name: Salidas Salidas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salidas"
    ADD CONSTRAINT "Salidas_pkey" PRIMARY KEY ("IdSalida");


--
-- TOC entry 4964 (class 2606 OID 16477)
-- Name: Usuario Usuario_Email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_Email_key" UNIQUE ("Email");


--
-- TOC entry 4966 (class 2606 OID 16479)
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("IdUsuario");


--
-- TOC entry 4970 (class 2606 OID 16548)
-- Name: Ventas Ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas"
    ADD CONSTRAINT "Ventas_pkey" PRIMARY KEY ("IdVenta");


--
-- TOC entry 4968 (class 2606 OID 16532)
-- Name: bitacora_actividades bitacora_actividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora_actividades
    ADD CONSTRAINT bitacora_actividades_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 16480)
-- Name: Articulos Articulos_ClaUserMod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_ClaUserMod_fkey" FOREIGN KEY ("ClaUserMod") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4982 (class 2606 OID 16485)
-- Name: Articulos Articulos_IdCfgStock_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_IdCfgStock_fkey" FOREIGN KEY ("IdCfgStock") REFERENCES public."CfgStock"("IdCfgStock");


--
-- TOC entry 4983 (class 2606 OID 16490)
-- Name: Articulos Articulos_IdProveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_IdProveedor_fkey" FOREIGN KEY ("IdProveedor") REFERENCES public."Proveedores"("IdProveedor");


--
-- TOC entry 4984 (class 2606 OID 16623)
-- Name: Articulos Articulos_IdUsuarioCreacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_IdUsuarioCreacion_fkey" FOREIGN KEY ("IdUsuarioCreacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4985 (class 2606 OID 16628)
-- Name: Articulos Articulos_IdUsuarioModificacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Articulos"
    ADD CONSTRAINT "Articulos_IdUsuarioModificacion_fkey" FOREIGN KEY ("IdUsuarioModificacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4997 (class 2606 OID 16634)
-- Name: Combos Combos_IdUsuarioCreacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Combos"
    ADD CONSTRAINT "Combos_IdUsuarioCreacion_fkey" FOREIGN KEY ("IdUsuarioCreacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4998 (class 2606 OID 16639)
-- Name: Combos Combos_IdUsuarioModificacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Combos"
    ADD CONSTRAINT "Combos_IdUsuarioModificacion_fkey" FOREIGN KEY ("IdUsuarioModificacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4999 (class 2606 OID 16601)
-- Name: DetalleCombos DetalleCombos_IdArticulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCombos"
    ADD CONSTRAINT "DetalleCombos_IdArticulo_fkey" FOREIGN KEY ("IdArticulo") REFERENCES public."Articulos"("IdArticulo");


--
-- TOC entry 5000 (class 2606 OID 16596)
-- Name: DetalleCombos DetalleCombos_IdCombo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCombos"
    ADD CONSTRAINT "DetalleCombos_IdCombo_fkey" FOREIGN KEY ("IdCombo") REFERENCES public."Combos"("IdCombo");


--
-- TOC entry 5003 (class 2606 OID 16722)
-- Name: DetalleEntradas DetalleEntradas_IdArticulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleEntradas"
    ADD CONSTRAINT "DetalleEntradas_IdArticulo_fkey" FOREIGN KEY ("IdArticulo") REFERENCES public."Articulos"("IdArticulo");


--
-- TOC entry 5004 (class 2606 OID 16717)
-- Name: DetalleEntradas DetalleEntradas_IdEntrada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleEntradas"
    ADD CONSTRAINT "DetalleEntradas_IdEntrada_fkey" FOREIGN KEY ("IdEntrada") REFERENCES public."Entradas"("IdEntrada");


--
-- TOC entry 4994 (class 2606 OID 16570)
-- Name: DetalleVentas DetalleVentas_IdArticulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT "DetalleVentas_IdArticulo_fkey" FOREIGN KEY ("IdArticulo") REFERENCES public."Articulos"("IdArticulo");


--
-- TOC entry 4995 (class 2606 OID 16606)
-- Name: DetalleVentas DetalleVentas_IdCombo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT "DetalleVentas_IdCombo_fkey" FOREIGN KEY ("IdCombo") REFERENCES public."Combos"("IdCombo");


--
-- TOC entry 4996 (class 2606 OID 16565)
-- Name: DetalleVentas DetalleVentas_IdVenta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT "DetalleVentas_IdVenta_fkey" FOREIGN KEY ("IdVenta") REFERENCES public."Ventas"("IdVenta");


--
-- TOC entry 5001 (class 2606 OID 16696)
-- Name: Entradas Entradas_IdProveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entradas"
    ADD CONSTRAINT "Entradas_IdProveedor_fkey" FOREIGN KEY ("IdProveedor") REFERENCES public."Proveedores"("IdProveedor");


--
-- TOC entry 5002 (class 2606 OID 16701)
-- Name: Entradas Entradas_IdUsuarioCreacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entradas"
    ADD CONSTRAINT "Entradas_IdUsuarioCreacion_fkey" FOREIGN KEY ("IdUsuarioCreacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4986 (class 2606 OID 16612)
-- Name: Proveedores Proveedores_IdUsuarioCreacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedores"
    ADD CONSTRAINT "Proveedores_IdUsuarioCreacion_fkey" FOREIGN KEY ("IdUsuarioCreacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4987 (class 2606 OID 16617)
-- Name: Proveedores Proveedores_IdUsuarioModificacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedores"
    ADD CONSTRAINT "Proveedores_IdUsuarioModificacion_fkey" FOREIGN KEY ("IdUsuarioModificacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4988 (class 2606 OID 16505)
-- Name: Salidas Salidas_ClaUserMod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salidas"
    ADD CONSTRAINT "Salidas_ClaUserMod_fkey" FOREIGN KEY ("ClaUserMod") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4989 (class 2606 OID 16510)
-- Name: Salidas Salidas_IdArticulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salidas"
    ADD CONSTRAINT "Salidas_IdArticulo_fkey" FOREIGN KEY ("IdArticulo") REFERENCES public."Articulos"("IdArticulo");


--
-- TOC entry 4990 (class 2606 OID 16645)
-- Name: Usuario Usuario_IdUsuarioCreacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_IdUsuarioCreacion_fkey" FOREIGN KEY ("IdUsuarioCreacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4991 (class 2606 OID 16650)
-- Name: Usuario Usuario_IdUsuarioModificacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_IdUsuarioModificacion_fkey" FOREIGN KEY ("IdUsuarioModificacion") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4993 (class 2606 OID 16549)
-- Name: Ventas Ventas_IdUsuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas"
    ADD CONSTRAINT "Ventas_IdUsuario_fkey" FOREIGN KEY ("IdUsuario") REFERENCES public."Usuario"("IdUsuario");


--
-- TOC entry 4992 (class 2606 OID 16533)
-- Name: bitacora_actividades bitacora_actividades_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora_actividades
    ADD CONSTRAINT bitacora_actividades_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public."Usuario"("IdUsuario") ON DELETE SET NULL;


-- Completed on 2025-12-01 18:09:59

--
-- PostgreSQL database dump complete
--

\unrestrict qPNicwbgkPb222uKnvClqvcnk4GfN1w90Kbym3FAqgRfVeWTFnLu4yTT0vebUfb

