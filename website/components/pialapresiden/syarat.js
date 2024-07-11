import React from 'react';
import PropTypes from 'prop-types';
// import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    indicator: {
        backgroundColor: '#F3CC47'
    }
}));

export default function FullWidthTabs() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{
                backgroundColor: 'transparent !important',
                border: '2px solid #F3CC47'
            }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    classes={{
                        indicator: classes.indicator
                    }}
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs exavple"
                    style={{
                        backgroundColor: 'transparent !important',
                        color: '#FFF !important',
                        margin: '0 !important',
                        padding: '0 !important',
                        height: 'auto!important'
                    }}
                >
                    <Tab label="Syarat & Ketentuan" {...a11yProps(0)} />
                    <Tab label="Sistem Pertandingan" {...a11yProps(1)} />
                    <Tab label="Karakter Permainan Fruit Dart" {...a11yProps(2)} />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0} dir={theme.direction} style={{
                backgroundColor: 'none',
                border: '1px solid #F3CC47',
                color: '#FFF',
                padding: '20px',
                fontSize: '14px',
                lineHeight: '30px',
                textAlign: 'justify'
            }}>
                Setiap pemain yang berpartisipasi harus memenuhi persyaratan sebagai berikut:
                <ul>
                    <li>Pemain berusia minimal 18 tahun yang dibuktikan dengan identitas Kartu Tanda Penduduk (KTP).</li>
                    <li>Pemain yang berusia dibawah 18 tahun harus melampirkan surat keterangan dari orang tua untuk mengikuti turnamen beserta Kartu Keluarga.</li>
                    <li>Pemain harus menampilkan nomor telepon yang terdaftar sebagai pemain aktif vpl.</li>
                    <li>Biaya transportasi pemain yang berhasil lolos ke babak kualifikasi dan Grand Final akan ditanggung oleh pihak penyelenggara dengan jumlah maksimal Rp1 juta (kualifikasi) dan Rp2 juta (Grand Final). Pembayaran menggunakan sistem reimburse dengan mencantumkan bukti transaksi/booking.</li>
                    <li>Biaya penginapan akan diurus langsung oleh pihak penyelenggara.</li>
                    <li>vpl berhak untuk mendiskualifikasi peserta yang (a) Bertindak curang dan tidak jujur dalam mendapatkan skor dalam permainan (b) Bertindak secara tidak sportif atau mengganggu, menyalahgunakan, mengancam atau melecehkan pihak lainnya. </li>
                    <li>Keputusan vpl atas pemenang adalah bulat dan tidak dapat diganggu gugat.</li>
                </ul>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction} style={{
                backgroundColor: 'none',
                border: '1px solid #F3CC47',
                color: '#FFF',
                padding: '20px',
                fontSize: '14px',
                lineHeight: '30px',
                textAlign: 'justify'
            }}>
                <ol>
                    <li><b>Peraturan in-game:</b><br />
                        Game vpl yang akan dipertandingkan pada Piala Presiden Esports 2020 adalah Fruit Dart.
                        <ul>
                            <li>Pemenang ditentukan berdasarkan perolehan skor tertinggi.</li>
                            <li>Skor didapatkan dari banyaknya buah yang dipotong dan combo.</li>
                            <li>Jika pemain mengenai bom, permainan dinyatakan selesai. Penentuan pemenang tetap berdasarkan perolehan skor tertinggi.</li>
                            <li>Durasi tiap pertandingan adalah 3 menit dengan format sebagai berikut:
                                <ul>
                                    <li>Tahap Seleksi Online: Turnamen di Ruangan “Piala Presiden Esports 2020” pada Aplikasi vpl</li>
                                    <li>Tahap Kualifikasi Offline: 1vs1 knockout best-of-3 (BO3)</li>
                                    <li>Tahap Final Top 8 Offline: 1vs1 knockout best-of-5 (BO5) </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><b>Format Kompetisi</b><br />
                        Kompetisi vpl di Piala Presiden Esports 2020 akan diselenggarakan dalam tiga tahap:
                        <ol style={{ listStyleType: 'lower-alpha' }}>
                            <li>
                                <b>Seleksi Piala Presiden Esports 2020 Diperpanjang Hingga 8 Desember 2019</b><br />
                                Tahapan dimulai dengan kualifikasi online yang diselenggarakan di aplikasi vpl. Fase ini dibagi berdasarkan regional, yakni barat dan timur. 128 pemain dengan skor tertinggi di kedua regional (64 pemain tiap regional) berhak melaju ke babak berikutnya. Seleksi Piala Presiden Esports 2020 akan diadakan online di ruangan turnamen dalam aplikasi vpl. Seleksi akan dimulai pada Senin – Minggu, 18 November – 8 Desember 2019, pukul 00.00 – 23.59 WIB.
                            </li>
                            <li>
                                <b>Kualifikasi Piala Presiden Esports 2020 (11 & 18 Januari 2020)</b><br />
                                Tahapan ini mengikutsertakan 128 pemain yang terdiri dari 64 pemain untuk tiap regionalnya. Partisipan yang lolos ke tahap ini wajib menghadiri event offline yang akan diselenggarakan di Bandung (regional barat) dan Surabaya (regional timur). 16 pemain dengan skor tertinggi di tiap regional akan lolos ke tahap selanjutnya. Sistem pertandingan yang akan digunakan adalah knockout 1vs1 (BO3). Kualifikasi offline regional timur diadakan di Kota Surabaya pada Sabtu, 11 Januari 2020, dan regional barat diadakan di Kota Bandung pada Sabtu, 18 Januari 2020.
                            </li>
                            <li>
                                <b>Final Piala Presiden Esports </b><br />
                                Tahapan final Piala Presiden Esports 2020 akan diikuti oleh 32 pemain terbaik dari tahap kualifikasi. Partisipan wajib hadir di event yang akan diselenggarakan di Jakarta. Sistem pertandingan yang akan digunakan dari babak 32 besar hingga 16 besar adalah knockout 1vs1 (BO3). Masuk ke babak delapan besar, pemain harus memenangkan total tiga pertandingan untuk lolos ke babak selanjutnya (BO5).
                            </li>
                        </ol>
                    </li>
                    <li>
                        <b>Total Hadiah</b><br />
                        Juara I: Rp125.000.000<br />
                        Juara II: Rp75.000.000<br />
                        Juara III: Rp30.000.000<br />
                        Juara IV-VIII: Rp4.000.000
                    </li>
                </ol>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction} style={{
                backgroundColor: 'none',
                border: '1px solid #F3CC47',
                color: '#FFF',
                padding: '20px',
                fontSize: '14px',
                lineHeight: '30px',
                textAlign: 'justify'
            }}>
                <ol>
                    <li>
                        Fruit Dart dimainkan dengan melempar pisau pada buah-buahan.
                    </li>
                    <li>
                        Pemain harus mengumpulkan skor setinggi-tingginya selama permainan.
                    </li>
                    <li>
                        Lemparan pisau tidak boleh mengenai bom. Jika terkena bom, permainan dinyatakan selesai.
                    </li>
                    <li>
                        Fruit Dart memiliki beberapa jenis Power Up, antara lain:
                        <ul>
                            <li>
                                Shield/perisai. Melindungi pemain dari ledakan bom.
                            </li>
                            <li>
                                Kecepatan 2x lipat. Buah lebih cepat muncul, bisa memotong lebih banyak buah.
                            </li>
                            <li>
                                Shuriken/multi knife. Senjata ninja dengan jangkauan potong lebih luas.
                            </li>
                            <li>
                                Pisau kecil. Pisau lebih cepat mengenai buah yang akan dipotong.
                            </li>
                            <li>
                                Pisau panjang. Jangkauan potongnya lebih lebar.
                            </li>
                        </ul>
                    </li>
                    <li>
                        Fruit Combo! Skor lebih banyak diperoleh jika berhasil memotong buah secara bersamaan.
                    </li>
                    <li>
                        Satu game play Fruit Dart berdurasi 3 menit.
                    </li>
                </ol>
            </TabPanel>
        </div>
    )
}