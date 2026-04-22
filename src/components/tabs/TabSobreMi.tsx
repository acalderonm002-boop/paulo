"use client";

import type { CSSProperties } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Home,
  Languages,
  Newspaper,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import ProfileSection from "@/components/ProfileSection";
import type { Broker } from "@/lib/brokers";

type Props = { broker: Broker };

const serif: CSSProperties = {
  fontFamily: "var(--font-dm-serif), Georgia, serif",
};

function yearRange(
  desde?: number | null,
  hasta?: number | null
): string {
  const from = desde != null ? String(desde) : null;
  const to = hasta != null ? String(hasta) : "Presente";
  if (!from && hasta == null) return "";
  if (!from) return to;
  return `${from} – ${to}`;
}

function certPrimary(cert: Broker["certificaciones"][number]): string {
  return cert.nombre_completo ?? cert.nombre ?? "";
}

function certYear(cert: Broker["certificaciones"][number]): number | undefined {
  return cert.año ?? cert.anio;
}

export default function TabSobreMi({ broker }: Props) {
  const bioParagraphs = (broker.bio_larga ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const stats: { value: string; label: string }[] = [];
  if (broker.stats.propiedades_vendidas > 0) {
    stats.push({
      value: `${broker.stats.propiedades_vendidas}+`,
      label: "Propiedades",
    });
  }
  if (broker.stats.transacciones > 0) {
    stats.push({
      value: `${broker.stats.transacciones}+`,
      label: "Transacciones",
    });
  }
  if (broker.stats.clientes > 0) {
    stats.push({
      value: `${broker.stats.clientes}+`,
      label: "Clientes",
    });
  }
  if (broker.anios_experiencia != null && broker.anios_experiencia > 0) {
    stats.push({
      value: `${broker.anios_experiencia}+`,
      label: "Años",
    });
  }

  const hasBio = bioParagraphs.length > 0;
  const hasStats = stats.length > 0;
  const hasTipos = broker.tipos_propiedad.length > 0;
  const hasZonas = broker.zonas_especializacion.length > 0;
  const hasEspecialidad = hasTipos || hasZonas;
  const hasServicios = broker.servicios.length > 0;
  const hasIdiomas = broker.idiomas.length > 0;
  const hasCerts = broker.certificaciones.length > 0;
  const hasEducacion = broker.educacion.length > 0;
  const hasCursos = broker.cursos.length > 0;
  const hasTrayectoria = broker.trayectoria.length > 0;
  const hasPublicaciones = broker.publicaciones.length > 0;
  const hasAwards = broker.awards.length > 0;
  const hasAsociaciones = broker.asociaciones.length > 0;
  const hasVoluntariado = broker.voluntariado.length > 0;
  const hasFeatured = broker.featured.length > 0;

  const dividerClass = "border-0 h-px";
  const dividerStyle: CSSProperties = { backgroundColor: "#D9D2C3" };

  return (
    <section
      id="sobre-mi"
      className="bg-[color:var(--cream)] text-[color:var(--text-primary)]"
    >
      <div className="max-w-[760px] mx-auto px-5 sm:px-8 pb-16">
        {/* 1. TÍTULO EDITORIAL */}
        <ProfileSection className="pt-10 md:pt-12">
          <h1
            className="leading-[1.05]"
            style={{
              ...serif,
              fontSize: "clamp(32px, 5vw, 48px)",
            }}
          >
            Sobre mí
          </h1>
          {broker.filosofia && (
            <p
              className="mt-4 text-[color:var(--text-secondary)]"
              style={{
                ...serif,
                fontSize: "clamp(16px, 1.7vw, 20px)",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              {broker.filosofia}
            </p>
          )}
        </ProfileSection>

        {/* 2. BIO NARRATIVA */}
        {hasBio && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection>
              <div className="space-y-5">
                {bioParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] md:text-base"
                    style={{
                      color: "#1A1A1A",
                      lineHeight: 1.8,
                      maxWidth: "60ch",
                    }}
                  >
                    {i === 0 && p.length > 200 ? (
                      <>
                        <span
                          className="float-left mr-2 mt-1 leading-none"
                          style={{
                            ...serif,
                            fontSize: "56px",
                            lineHeight: 0.9,
                            color: "#1A1A1A",
                          }}
                        >
                          {p.charAt(0)}
                        </span>
                        {p.slice(1)}
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>
            </ProfileSection>
          </>
        )}

        {/* 3. NÚMEROS QUE IMPORTAN */}
        {hasStats && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Números que importan">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div
                      className="leading-none"
                      style={{
                        ...serif,
                        fontSize: "clamp(32px, 4vw, 44px)",
                        color: "#1A1A1A",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="mt-2 text-[11px] uppercase"
                      style={{
                        color: "#5C5C5C",
                        letterSpacing: "1.5px",
                        fontWeight: 600,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSection>
          </>
        )}

        {/* 4. ESPECIALIDAD */}
        {hasEspecialidad && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Especialidad">
              {hasTipos && (
                <div className="mb-6">
                  <p
                    className="text-[11px] uppercase mb-3"
                    style={{
                      color: "#5C5C5C",
                      letterSpacing: "1.5px",
                      fontWeight: 600,
                    }}
                  >
                    Tipos de propiedad
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {broker.tipos_propiedad.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center text-[13px]"
                        style={{
                          border: "1px solid #D9D2C3",
                          borderRadius: 999,
                          padding: "6px 14px",
                          color: "#1A1A1A",
                          backgroundColor: "transparent",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hasZonas && (
                <div>
                  <p
                    className="text-[11px] uppercase mb-3"
                    style={{
                      color: "#5C5C5C",
                      letterSpacing: "1.5px",
                      fontWeight: 600,
                    }}
                  >
                    Zonas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {broker.zonas_especializacion.map((z) => (
                      <span
                        key={z}
                        className="inline-flex items-center text-[13px]"
                        style={{
                          border: "1px solid #D9D2C3",
                          borderRadius: 999,
                          padding: "6px 14px",
                          color: "#1A1A1A",
                          backgroundColor: "transparent",
                        }}
                      >
                        {z}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </ProfileSection>
          </>
        )}

        {/* 5. SERVICIOS */}
        {hasServicios && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Servicios">
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {broker.servicios.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 text-[15px]"
                    style={{ color: "#1A1A1A" }}
                  >
                    <Sparkles
                      size={14}
                      strokeWidth={2}
                      className="text-[color:var(--text-secondary)] shrink-0"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 6. IDIOMAS */}
        {hasIdiomas && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Idiomas">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                <Languages
                  size={16}
                  strokeWidth={2}
                  className="text-[color:var(--text-secondary)]"
                />
                {broker.idiomas.map((idi, i) => (
                  <span
                    key={`${idi.idioma}-${i}`}
                    className="inline-flex items-center text-[15px]"
                    style={{ color: "#1A1A1A" }}
                  >
                    <span>{idi.idioma}</span>
                    {idi.nivel && (
                      <span
                        className="ml-1.5 text-[13px]"
                        style={{ color: "#5C5C5C" }}
                      >
                        — {idi.nivel}
                      </span>
                    )}
                    {i < broker.idiomas.length - 1 && (
                      <span
                        className="mx-2"
                        aria-hidden
                        style={{ color: "#D9D2C3" }}
                      >
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </ProfileSection>
          </>
        )}

        {/* 7. CERTIFICACIONES */}
        {hasCerts && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Certificaciones y licencias">
              <ul className="space-y-5">
                {broker.certificaciones.map((cert, i) => {
                  const primary = certPrimary(cert);
                  const año = certYear(cert);
                  return (
                    <li
                      key={`${primary}-${i}`}
                      className="flex items-start gap-4"
                    >
                      <Award
                        size={18}
                        strokeWidth={2}
                        className="mt-1 shrink-0"
                        style={{ color: "#1A1A1A" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span
                            className="text-[15px]"
                            style={{ color: "#1A1A1A", fontWeight: 600 }}
                          >
                            {primary}
                          </span>
                          {cert.siglas && cert.siglas !== primary && (
                            <span
                              className="text-[13px]"
                              style={{ color: "#5C5C5C" }}
                            >
                              ({cert.siglas})
                            </span>
                          )}
                        </div>
                        <div
                          className="mt-1 text-[13px]"
                          style={{ color: "#5C5C5C" }}
                        >
                          {[cert.otorgante, año].filter(Boolean).join(" · ")}
                          {!cert.otorgante && !año && cert.descripcion}
                        </div>
                        {cert.otorgante && cert.descripcion && (
                          <p
                            className="mt-1 text-[13px]"
                            style={{ color: "#5C5C5C", lineHeight: 1.6 }}
                          >
                            {cert.descripcion}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 8. EDUCACIÓN */}
        {hasEducacion && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Educación">
              <ul className="space-y-5">
                {broker.educacion.map((e, i) => (
                  <li
                    key={`${e.institucion}-${i}`}
                    className="flex items-start gap-4"
                  >
                    <GraduationCap
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0"
                      style={{ color: "#1A1A1A" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[15px]"
                        style={{ color: "#1A1A1A", fontWeight: 600 }}
                      >
                        {e.institucion}
                      </div>
                      <div
                        className="mt-1 text-[13px]"
                        style={{ color: "#5C5C5C" }}
                      >
                        {[e.grado, e.area].filter(Boolean).join(" · ")}
                      </div>
                      {(e.año_inicio != null || e.año_fin != null) && (
                        <div
                          className="mt-0.5 text-[12px] uppercase"
                          style={{
                            color: "#5C5C5C",
                            letterSpacing: "1.5px",
                          }}
                        >
                          {yearRange(e.año_inicio, e.año_fin)}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 9. CURSOS Y DIPLOMADOS */}
        {hasCursos && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Cursos y diplomados">
              <ul className="space-y-4">
                {broker.cursos.map((c, i) => (
                  <li
                    key={`${c.nombre}-${i}`}
                    className="flex items-start gap-4"
                  >
                    <BookOpen
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0"
                      style={{ color: "#1A1A1A" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[15px]"
                        style={{ color: "#1A1A1A", fontWeight: 600 }}
                      >
                        {c.nombre}
                      </div>
                      <div
                        className="mt-1 text-[13px]"
                        style={{ color: "#5C5C5C" }}
                      >
                        {[c.institucion, c.año].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 10. TRAYECTORIA */}
        {hasTrayectoria && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Trayectoria profesional">
              <ol className="relative pl-6 space-y-7">
                <span
                  aria-hidden
                  className="absolute left-[6px] top-1 bottom-1 w-px"
                  style={{ backgroundColor: "#D9D2C3" }}
                />
                {broker.trayectoria.map((t, i) => (
                  <li key={`${t.brokerage}-${i}`} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: "#F5F1EA",
                        border: "2px solid #1A1A1A",
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Briefcase
                        size={14}
                        strokeWidth={2}
                        style={{ color: "#1A1A1A" }}
                      />
                      <span
                        className="text-[15px]"
                        style={{ color: "#1A1A1A", fontWeight: 600 }}
                      >
                        {t.brokerage}
                      </span>
                    </div>
                    {t.rol && (
                      <div
                        className="mt-1 text-[13px]"
                        style={{ color: "#5C5C5C" }}
                      >
                        {t.rol}
                      </div>
                    )}
                    {(t.desde != null || t.hasta !== undefined) && (
                      <div
                        className="mt-0.5 text-[12px] uppercase"
                        style={{
                          color: "#5C5C5C",
                          letterSpacing: "1.5px",
                        }}
                      >
                        {yearRange(t.desde, t.hasta)}
                      </div>
                    )}
                    {t.descripcion && (
                      <p
                        className="mt-2 text-[14px]"
                        style={{
                          color: "#1A1A1A",
                          lineHeight: 1.65,
                          maxWidth: "60ch",
                        }}
                      >
                        {t.descripcion}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </ProfileSection>
          </>
        )}

        {/* 11. PUBLICACIONES */}
        {hasPublicaciones && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Publicaciones y prensa">
              <ul className="space-y-5">
                {broker.publicaciones.map((p, i) => (
                  <li
                    key={`${p.titulo}-${i}`}
                    className="flex items-start gap-4"
                  >
                    <Newspaper
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0"
                      style={{ color: "#1A1A1A" }}
                    />
                    <div className="min-w-0 flex-1">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[15px] hover:underline"
                          style={{ color: "#1A1A1A", fontWeight: 600 }}
                        >
                          {p.titulo}
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <div
                          className="text-[15px]"
                          style={{ color: "#1A1A1A", fontWeight: 600 }}
                        >
                          {p.titulo}
                        </div>
                      )}
                      <div
                        className="mt-1 text-[13px]"
                        style={{ color: "#5C5C5C" }}
                      >
                        {[p.medio, p.fecha].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 12. AWARDS */}
        {hasAwards && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Awards y reconocimientos">
              <ul className="space-y-5">
                {broker.awards.map((a, i) => (
                  <li
                    key={`${a.titulo}-${i}`}
                    className="flex items-start gap-4"
                  >
                    <Trophy
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0"
                      style={{ color: "#1A1A1A" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[15px]"
                        style={{ color: "#1A1A1A", fontWeight: 600 }}
                      >
                        {a.titulo}
                      </div>
                      <div
                        className="mt-1 text-[13px]"
                        style={{ color: "#5C5C5C" }}
                      >
                        {[a.otorgante, a.año].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 13. ASOCIACIONES */}
        {hasAsociaciones && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Asociaciones">
              <ul className="space-y-5">
                {broker.asociaciones.map((a, i) => (
                  <li
                    key={`${a.nombre}-${i}`}
                    className="flex items-start gap-4"
                  >
                    <Users
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0"
                      style={{ color: "#1A1A1A" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[15px]"
                        style={{ color: "#1A1A1A", fontWeight: 600 }}
                      >
                        {a.nombre}
                      </div>
                      {a.rol && (
                        <div
                          className="mt-1 text-[13px]"
                          style={{ color: "#5C5C5C" }}
                        >
                          {a.rol}
                        </div>
                      )}
                      {(a.desde != null || a.hasta !== undefined) && (
                        <div
                          className="mt-0.5 text-[12px] uppercase"
                          style={{
                            color: "#5C5C5C",
                            letterSpacing: "1.5px",
                          }}
                        >
                          {yearRange(a.desde, a.hasta)}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 14. VOLUNTARIADO */}
        {hasVoluntariado && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Voluntariado">
              <ul className="space-y-5">
                {broker.voluntariado.map((v, i) => (
                  <li
                    key={`${v.organizacion}-${i}`}
                    className="flex items-start gap-4"
                  >
                    <HeartHandshake
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0"
                      style={{ color: "#1A1A1A" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[15px]"
                        style={{ color: "#1A1A1A", fontWeight: 600 }}
                      >
                        {v.organizacion}
                      </div>
                      {v.rol && (
                        <div
                          className="mt-1 text-[13px]"
                          style={{ color: "#5C5C5C" }}
                        >
                          {v.rol}
                        </div>
                      )}
                      {(v.desde != null || v.hasta !== undefined) && (
                        <div
                          className="mt-0.5 text-[12px] uppercase"
                          style={{
                            color: "#5C5C5C",
                            letterSpacing: "1.5px",
                          }}
                        >
                          {yearRange(v.desde, v.hasta)}
                        </div>
                      )}
                      {v.descripcion && (
                        <p
                          className="mt-2 text-[14px]"
                          style={{
                            color: "#1A1A1A",
                            lineHeight: 1.65,
                            maxWidth: "60ch",
                          }}
                        >
                          {v.descripcion}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </>
        )}

        {/* 15. FEATURED */}
        {hasFeatured && (
          <>
            <hr className={dividerClass} style={dividerStyle} />
            <ProfileSection title="Featured">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {broker.featured.map((f, i) => {
                  const inner = (
                    <div className="flex gap-4">
                      {f.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.thumbnail_url}
                          alt=""
                          className="w-20 h-20 object-cover shrink-0"
                          style={{
                            borderRadius: 8,
                            border: "1px solid #D9D2C3",
                          }}
                        />
                      ) : (
                        <div
                          className="w-20 h-20 shrink-0 flex items-center justify-center"
                          style={{
                            borderRadius: 8,
                            border: "1px solid #D9D2C3",
                            backgroundColor: "#EAE4D8",
                          }}
                        >
                          <Home
                            size={22}
                            strokeWidth={1.5}
                            style={{ color: "#5C5C5C" }}
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {f.tipo && (
                          <div
                            className="text-[11px] uppercase mb-1"
                            style={{
                              color: "#5C5C5C",
                              letterSpacing: "1.5px",
                              fontWeight: 600,
                            }}
                          >
                            {f.tipo}
                          </div>
                        )}
                        <div
                          className="text-[15px]"
                          style={{ color: "#1A1A1A", fontWeight: 600 }}
                        >
                          {f.titulo}
                        </div>
                        {f.descripcion && (
                          <p
                            className="mt-1 text-[13px]"
                            style={{
                              color: "#5C5C5C",
                              lineHeight: 1.55,
                            }}
                          >
                            {f.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                  return (
                    <li key={`${f.titulo}-${i}`}>
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 transition-colors hover:bg-[color:var(--cream-secondary)]"
                          style={{
                            border: "1px solid #D9D2C3",
                            borderRadius: 10,
                          }}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div
                          className="p-4"
                          style={{
                            border: "1px solid #D9D2C3",
                            borderRadius: 10,
                          }}
                        >
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </ProfileSection>
          </>
        )}
      </div>
    </section>
  );
}
