export const spiderTypesOptions = [
  { label: "Wybierz...", value: "" },
  { label: "Ptasznik (Theraphosidae)", value: "tarantula" },
  { label: "Skakun (Salticidae)", value: "jumping_spider" },
  { label: "Kukulnik (Araneidae)", value: "orb_weaver" },
  { label: "Biegunek (Lycosidae)", value: "wolf_spider" },
  { label: "Kątnik (Agelenidae)", value: "funnel_web_spider" },
  { label: "Krzyżak (Araneus)", value: "cross_spider" },
  { label: "Zbrojnik (Sicariidae)", value: "recluse_spider" },
  { label: "Wdowa (Latrodectus)", value: "black_widow" },
  { label: "Topik (Argyroneta aquatica)", value: "diving_bell_spider" },
];

export const spiderSpeciesByType = {
  tarantula: [
    { label: "Wybierz...", value: "" },
    { label: "Brachypelma hamorii", value: "brachypelma_hamorii" },
    { label: "Brachypelma albopilosum", value: "brachypelma_albopilosum" },
    {
      label: "Chromatopelma cyaneopubescens",
      value: "chromatopelma_cyaneopubescens",
    },
    { label: "Aphonopelma chalcodes", value: "aphonopelma_chalcodes" },
    { label: "Grammostola rosea", value: "grammostola_rosea" },
    { label: "Grammostola cala", value: "grammostola_cala" },
    { label: "Lasiodora parahybana", value: "lasiodora_parahybana" },
  ],
  jumping_spider: [
    { label: "Wybierz...", value: "" },
    { label: "Phidippus regius", value: "phidippus_regius" },
    { label: "Phidippus audax", value: "phidippus_audax" },
    { label: "Salticus scenicus", value: "salticus_scenicus" },
    { label: "Salticus cingulatus", value: "salticus_cingulatus" },
    { label: "Marpissa muscosa", value: "marpissa_muscosa" },
    { label: "Menemerus semilimbatus", value: "menemerus_semilimbatus" },
  ],
  orb_weaver: [
    { label: "Wybierz...", value: "" },
    { label: "Araneus diadematus", value: "araneus_diadematus" },
    { label: "Araneus quadratus", value: "araneus_quadratus" },
    { label: "Neoscona crucifera", value: "neoscona_crucifera" },
    { label: "Cyclosa conica", value: "cyclosa_conica" },
    { label: "Zygiella x-notata", value: "zygiella_x_notata" },
  ],
  wolf_spider: [
    { label: "Wybierz...", value: "" },
    { label: "Lycosa tarantula", value: "lycosa_tarantula" },
    { label: "Lycosa tarentula", value: "lycosa_tarentula" },
    { label: "Hogna radiata", value: "hogna_radiata" },
    { label: "Pardosa amentata", value: "pardosa_amentata" },
    { label: "Pardosa palustris", value: "pardosa_palustris" },
  ],
  funnel_web_spider: [
    { label: "Wybierz...", value: "" },
    { label: "Agelena labyrinthica", value: "agelena_labyrinthica" },
    { label: "Tegenaria domestica", value: "tegenaria_domestica" },
    { label: "Tegenaria atrica", value: "tegenaria_atrica" },
    { label: "Coelotes terrestris", value: "coelotes_terrestris" },
  ],
  cross_spider: [
    { label: "Wybierz...", value: "" },
    { label: "Araneus quadratus", value: "araneus_quadratus" },
    { label: "Araneus diadematus", value: "araneus_diadematus" },
    { label: "Araneus marmoreus", value: "araneus_marmoreus" },
  ],
  recluse_spider: [
    { label: "Wybierz...", value: "" },
    { label: "Loxosceles reclusa", value: "loxosceles_reclusa" },
    { label: "Loxosceles deserta", value: "loxosceles_deserta" },
    { label: "Loxosceles laeta", value: "loxosceles_laeta" },
  ],
  black_widow: [
    { label: "Wybierz...", value: "" },
    { label: "Latrodectus mactans", value: "latrodectus_mactans" },
    { label: "Latrodectus hesperus", value: "latrodectus_hesperus" },
    { label: "Latrodectus geometricus", value: "latrodectus_geometricus" },
  ],
  diving_bell_spider: [
    { label: "Wybierz...", value: "" },
    { label: "Argyroneta aquatica", value: "argyroneta_aquatica" },
  ],
};

export const feedingFrequencyOptions = [
  { label: "Wybierz...", value: "" },
  { label: "Kilka razy w tygodniu", value: "few_times_week" },
  { label: "Raz w tygodniu", value: "once_week" },
  { label: "Raz na dwa tygodnie", value: "once_two_weeks" },
  { label: "Dwa razy w miesiącu", value: "twice_month" },
  { label: "Raz w miesiącu", value: "once_month" },
  { label: "Rzadziej", value: "rarely" },
];
