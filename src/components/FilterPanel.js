import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { hasSignUpLink } from "./SignUpLink";

// any location with data older than this will not be displayed at all
export const tooStaleMinutes = 60; // unit in minutes

const useStyles = makeStyles((theme) => ({
    formControlLabel: {
        "text-align": "left",
        "align-items": "start",
        "margin-top": theme.spacing(1),
        width: `calc(100% - ${theme.spacing(4)}px)`,
    },
    formControl: {
        margin: theme.spacing(3),
    },
    mdPanel: {
        position: "sticky",
        top: 0,
        height: "200px",
    },
}));

function AvailabilityFilter(props) {
    const classes = useStyles();

    const handleChange = (e) => {
        props.onChange({
            ...props,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={props.onlyShowAvailable}
                            onChange={handleChange}
                            name="onlyShowAvailable"
                        />
                    }
                    label="Has Available Appointments"
                />
            </FormGroup>
        </FormControl>
    );
}
/*

function VaxTypeFilter(props) {
    const classes = useStyles();

    const handleChange = (e) => {
        const changedIndex = props.vaxTypeFilter.types.indexOf(e.target.name);
        const newFilters = [...props.vaxTypeFilter.include];
        newFilters[changedIndex] = e.target.checked;

        props.onChange({
            types: props.vaxTypeFilter.types,
            include: newFilters,
        });
    };

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Vaccine Type</FormLabel>
            <FormGroup>
                {props.vaxTypeFilter.types.map((vaxType, i) => {
                    return (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={props.vaxTypeFilter.include[i]}
                                    onChange={handleChange}
                                    name={vaxType}
                                />
                            }
                            label={vaxType}
                            key={vaxType}
                        />
                    );
                })}
            </FormGroup>
        </FormControl>
    );
}
*/

export default function FilterPanel(props) {
    const classes = useStyles();
    const theme = useTheme();
    const mdSize = useMediaQuery(theme.breakpoints.up("md"));

    const [staleFilter, setStaleFilter] = useState({
        showStaleData: false,
    });

    const [appointmentFilter, setAppointmentFilter] = useState({
        onlyShowAvailable: true,
    });
    /*
    const [vaxTypeFilter, setVaxTypeFilter] = useState({
        types: [],
        include: [],
    });
*/

    const { data, onChange } = props;

    /*   useEffect(() => {
        const vaxTypes = Array.from(
            new Set(
                data.reduce((acc, cur) => {
                    if (
                        cur.extraData &&
                        cur.extraData["Vaccinations offered"]
                    ) {
                        acc = acc.concat(
                            cur.extraData["Vaccinations offered"]
                                .split(",")
                                .map((d) => d.trim())
                        );
                    }
                    return acc;
                }, [])
            )
        );

        vaxTypes.push("Not Specified");

        setVaxTypeFilter({
            types: vaxTypes,
            include: Array.apply(null, Array(vaxTypes.length)).map((d) => true),
        });
    }, [data]);
*/
    useEffect(() => {
        onChange({
            showStaleData: (d) => {
                // Filter the locations that have "non-stale" data
                const oldestGoodTimestamp =
                    new Date() - tooStaleMinutes * 60 * 1000;
                if (staleFilter.showStaleData) {
                    return true; // show everything! (no ui for this though)
                } else {
                    let notStale =
                        !d.timestamp || d.timestamp >= oldestGoodTimestamp;
                    return !d.timestamp || d.timestamp >= oldestGoodTimestamp;
                }
            },
            hasAppointments: (d) => {
                if (appointmentFilter.onlyShowAvailable) {
                    return hasSignUpLink(d);
                }
                return true;
            },
            /*
            vaxType: (d) => {
                if (d.extraData && d.extraData["Vaccinations offered"]) {
                    const vaxes = d.extraData["Vaccinations offered"];
                    for (let i = 0; i < vaxTypeFilter.types.length; i++) {
                        if (
                            vaxTypeFilter.include[i] &&
                            vaxes.includes(vaxTypeFilter.types[i])
                        ) {
                            return true;
                        }
                    }

                    return false;
                } else {
                    return vaxTypeFilter.include[vaxTypeFilter.include.length];
                }
            },
*/
        });
    }, [onChange, appointmentFilter, staleFilter]); //,vaxTypeFilter]);

    return (
        <Grid container={true} className={mdSize ? classes.mdPanel : ""}>
            <Container>
                <Typography component="span">
                    <h3>Filter by:</h3>
                </Typography>
            </Container>

            <Grid item xs={12}>
                <AvailabilityFilter
                    onlyShowAvailable={appointmentFilter.onlyShowAvailable}
                    onChange={setAppointmentFilter}
                />
            </Grid>

            {/*
            <Grid item xs={12}>
                <VaxTypeFilter
                    vaxTypeFilter={vaxTypeFilter}
                    onChange={setVaxTypeFilter}
                />
            </Grid>
*/}
        </Grid>
    );
}
