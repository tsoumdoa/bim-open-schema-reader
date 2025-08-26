-- load parquet files
CREATE TABLE Descriptors AS
SELECT * FROM read_parquet('./Descriptors.parquet');

CREATE TABLE Documents AS
SELECT * FROM read_parquet('./Documents.parquet');

CREATE TABLE DoubleParameters AS
SELECT * FROM read_parquet('./DoubleParameters.parquet');

CREATE TABLE Entities AS
SELECT * FROM read_parquet('./Entities.parquet');

CREATE TABLE EntityParameters AS
SELECT * FROM read_parquet('./EntityParameters.parquet');

CREATE TABLE IntegerParameters AS
SELECT * FROM read_parquet('./IntegerParameters.parquet');

CREATE TABLE PointParameters AS
SELECT * FROM read_parquet('./PointParameters.parquet');

CREATE TABLE Points AS
SELECT * FROM read_parquet('./Points.parquet');

CREATE TABLE Relations AS
SELECT * FROM read_parquet('./Relations.parquet');

CREATE TABLE StringParameters AS
SELECT * FROM read_parquet('./StringParameters.parquet');

CREATE TABLE Strings AS
SELECT * FROM read_parquet('./Strings.parquet');

-- adding index to Documents, Entities, Points & Strings as those table don't have an idex
-- Entities table
CREATE TABLE Entities_New AS
SELECT
    *,
    (row_number() OVER () - 1) AS Index
FROM
    Entities;

DROP TABLE Entities;
ALTER TABLE Entities_New RENAME TO Entities;

-- Descriptors table
CREATE TABLE Descriptors_New AS
SELECT
    *,
    (row_number() OVER () - 1) AS Index
FROM
    Descriptors;

DROP TABLE Descriptors;
ALTER TABLE Descriptors_New RENAME TO Descriptors;

-- Documents table
CREATE TABLE Documents_New AS
SELECT
    *,
    (row_number() OVER () - 1) AS Index
FROM
    Documents;

DROP TABLE Documents;                --Rename Documents Table
ALTER TABLE Documents_New RENAME TO Documents;

-- Points table
CREATE TABLE Points_New AS
SELECT
    *,
    (row_number() OVER () - 1) AS Index
FROM
    Points;

DROP TABLE Points;                   --Rename Points Table
ALTER TABLE Points_New RENAME TO Points;

-- Strings table
CREATE TABLE Strings_New AS
SELECT
    *,
    (row_number() OVER () - 1) AS Index
FROM
    Strings;

DROP TABLE Strings;                    --Rename Strings Table
ALTER TABLE Strings_New RENAME TO Strings;

-- parameter enum table
CREATE OR REPLACE TABLE Enum_Parameter (
    Index INTEGER,
    ParameterType VARCHAR(20)
);

INSERT INTO Enum_Parameter (Index, ParameterType)
VALUES
(0, 'Int'),
(1, 'Double'),
(2, 'Entity'),
(3, 'String'),
(4, 'Point');


CREATE TABLE IF NOT EXISTS Enum_RelationType (
    Index INTEGER,
    RelationType VARCHAR(20)
);

INSERT INTO Enum_RelationType (Index, RelationType)
VALUES
(0, 'PartOf'),
(1, 'ElementOf'),
(2, 'ContainedIn'),
(3, 'InstanceOf'),
(4, 'HostedBy'),
(5, 'ChildOf'),
(6, 'HasLayer'),
(7, 'HasMaterial'),
(8, 'ConnectsTo'),
(9, 'HasConnector');


CREATE OR REPLACE SEQUENCE id_sequence START 0 MINVALUE 0 ;

CREATE or REPLACE TABLE enum_unit (
index INTEGER PRIMARY KEY DEFAULT nextval ('id_sequence'),
symbol VARCHAR (10) UNIQUE NOT NULL,
category VARCHAR (50) NOT NULL,
base_symbol VARCHAR (10) NOT NULL,
conversion_factor DOUBLE NOT NULL,
"offset" DOUBLE NOT NULL
) ;


-- unit enum table
INSERT INTO enum_unit (symbol,
category,
base_symbol,
conversion_factor,
"offset")
VALUES
-- Length
('m', 'length', 'm', 1.0, 0.0),
('ft', 'length', 'm', 0.3048, 0.0),
('mm', 'length', 'm', 0.001, 0.0),
('cm', 'length', 'm', 0.01, 0.0),
('dm', 'length', 'm', 0.1, 0.0),
('in', 'length', 'm', 0.0254, 0.0),
('yd', 'length', 'm', 0.9144, 0.0),
('mi', 'length', 'm', 1609.344, 0.0),

-- Area
('m2', 'area', 'm²', 1.0, 0.0),
('ft2', 'area', 'm²', 0.09290304, 0.0),
('cm2', 'area', 'm²', 0.0001, 0.0),
('mm2', 'area', 'm²', 0.000001, 0.0),
('in2', 'area', 'm²', 0.00064516, 0.0),
('yd2', 'area', 'm²', 0.83612736, 0.0),
('acre', 'area', 'm²', 4046.8564224, 0.0),
('ha', 'area', 'm²', 10000.0, 0.0),

-- Volume
('m3', 'volume', 'm³', 1.0, 0.0),
('ft3', 'volume', 'm³', 0.028316846592, 0.0),
('cm3', 'volume', 'm³', 0.000001, 0.0),
('mm3', 'volume', 'm³', 0.000000001, 0.0),
('in3', 'volume', 'm³', 0.000016387064, 0.0),
('yd3', 'volume', 'm³', 0.764554857984, 0.0),
('L', 'volume', 'm³', 0.001, 0.0),
('gal', 'volume', 'm³', 0.003785411784, 0.0),

-- Mass
('kg', 'mass', 'kg', 1.0, 0.0),
('g', 'mass', 'kg', 0.001, 0.0),
('lb', 'mass', 'kg', 0.45359237, 0.0),
('t', 'mass', 'kg', 1000.0, 0.0),
('ton_us', 'mass', 'kg', 907.18474, 0.0),

-- Force
('N', 'force', 'N', 1.0, 0.0),
('kN', 'force', 'N', 1000.0, 0.0),
('lbf', 'force', 'N', 4.4482216152605, 0.0),
('kip', 'force', 'N', 4448.2216152605, 0.0),

-- Pressure / Stress
('Pa', 'pressure-stress', 'Pa', 1.0, 0.0),
('kPa', 'pressure-stress', 'Pa', 1000.0, 0.0),
('MPa', 'pressure-stress', 'Pa', 1000000.0, 0.0),
('psi', 'pressure-stress', 'Pa', 6894.757293168, 0.0),
('ksi', 'pressure-stress', 'Pa', 6894757.293168, 0.0),
('psf', 'pressure-stress', 'Pa', 47.88025898, 0.0),
('bar', 'pressure-stress', 'Pa', 100000.0, 0.0),
('atm', 'pressure-stress', 'Pa', 101325.0, 0.0),

-- Temperature
('K', 'thermodynamic T', 'K', 1.0, 0.0),
('°C', 'thermodynamic T', 'K', 1.0, 273.15),
('°F', 'thermodynamic T', 'K', 5.0 / 9.0, 255.372222222),

-- Plane angle
('rad', 'plane angle', 'rad', 1.0, 0.0),
('deg', 'plane angle', 'rad', 0.017453292519943295, 0.0),

-- Speed
('m/s', 'speed', 'm/s', 1.0, 0.0),
('km/h', 'speed', 'm/s', 0.2777777777778, 0.0),
('mph', 'speed', 'm/s', 0.44704, 0.0),

-- Volumetric flow
('m3/s', 'volume flow', 'm³/s', 1.0, 0.0),
('L/s', 'volume flow', 'm³/s', 0.001, 0.0),
('L/min', 'volume flow', 'm³/s', 0.0000166666666667, 0.0),
('ft3/s', 'volume flow', 'm³/s', 0.028316846592, 0.0),
('ft3/min', 'volume flow', 'm³/s', 0.0004719474432, 0.0),
('gpm', 'volume flow', 'm³/s', 0.0000630901964, 0.0),

-- Power
('W', 'power', 'W', 1.0, 0.0),
('kW', 'power', 'W', 1000.0, 0.0),
('hp', 'power', 'W', 745.699871582, 0.0),

-- Energy
('J', 'energy', 'J', 1.0, 0.0),
('kJ', 'energy', 'J', 1000.0, 0.0),
('Wh', 'energy', 'J', 3600.0, 0.0),
('kWh', 'energy', 'J', 3600000.0, 0.0),
('Btu', 'energy', 'J', 1055.05585262, 0.0),

-- Frequency
('Hz', 'frequency', 'Hz', 1.0, 0.0),
('kHz', 'frequency', 'Hz', 1000.0, 0.0),

-- Electrical
('V', 'electric potential', 'V', 1.0, 0.0),
('kV', 'electric potential', 'V', 1000.0, 0.0),
('A', 'electric current', 'A', 1.0, 0.0),
('kA', 'electric current', 'A', 1000.0, 0.0),
('Ω', 'electric resistance', 'Ω', 1.0, 0.0),
('kΩ', 'electric resistance', 'Ω', 1000.0, 0.0),
('VA', 'apparent power', 'VA', 1.0, 0.0),
('kVA', 'apparent power', 'kVA', 1000.0, 0.0),

-- Lighting
('lx', 'illuminance', 'lx', 1.0, 0.0),
('fc', 'illuminance', 'lx', 10.76391041671, 0.0) ;


-- denormalize entities
CREATE OR REPLACE VIEW denorm_entities
AS
select LocalId,
GlobalId,
Entities."index" as index,
Entities.name as entity_name,
s_name.Strings as name,
s_category.Strings as category,
s_path.Strings as path_name,
s_title.Strings as project_name
from Entities
LEFT OUTER JOIN Strings AS s_name
ON Entities."name" = s_name."index"
LEFT OUTER JOIN Strings AS s_category
ON Entities.category = s_category."index"
LEFT OUTER JOIN Documents
ON Entities.Document = Documents."index"
LEFT OUTER JOIN Strings AS s_path
ON Documents.Path = s_path."index"
LEFT OUTER JOIN Strings AS s_title
ON Documents.Title = s_title."index" ;


-- denormalize descriptor
CREATE OR REPLACE VIEW denorm_descriptors
AS SELECT dsc.index as index,
strName.Strings as Name,
strUnit.Strings as Units,
strGroup.Strings as Group,
strType.Strings as Type
FROM Descriptors as dsc
LEFT OUTER JOIN Strings as strName
On strName.index = dsc.Name
LEFT OUTER JOIN Strings as strUnit
On strUnit.index = dsc.Units
LEFT OUTER JOIN Strings as strGroup
On strGroup.index = dsc.Group
LEFT OUTER JOIN Strings as strType
On strType.index = dsc.Type ;


-- denormalize StringParameters
CREATE OR REPLACE VIEW denorm_string_params
AS
select *
from StringParameters
JOIN Strings On Strings.index = StringParameters.Value
JOIN denorm_descriptors On denorm_descriptors.index = StringParameters.Descriptor ;

-- denormalize PointParameters
CREATE OR REPLACE VIEW denorm_points_params
AS
select *
from PointParameters
LEFT OUTER JOIN Points On Points.index = PointParameters.Value
LEFT OUTER JOIN denorm_descriptors On denorm_descriptors.index = PointParameters.Descriptor ;

-- denormalize Double Parameters
CREATE OR REPLACE VIEW denorm_double_params
AS
select *
from DoubleParameters
LEFT OUTER JOIN denorm_descriptors On denorm_descriptors.index = DoubleParameters.Descriptor ;

-- denormalize Integer Parameters
CREATE OR REPLACE VIEW denorm_integer_params
AS
select *
from IntegerParameters
LEFT OUTER JOIN denorm_descriptors On denorm_descriptors.index = IntegerParameters.Descriptor ;

-- denormalize Entity Parameters
CREATE OR REPLACE VIEW denorm_entity_params
AS
select *
from EntityParameters
LEFT OUTER JOIN denorm_descriptors On denorm_descriptors.index = EntityParameters.Descriptor
LEFT outer join denorm_entities as de on de.index = EntityParameters.Value ;
