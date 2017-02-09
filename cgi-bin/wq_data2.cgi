#!/bin/sh                                                                                                                                                                                               
 eval 'if [ -x /usr/local/cpanel/3rdparty/bin/perl ]; then exec /usr/local/cpanel/3rdparty/bin/perl -x -- $0 ${1+"$@"}; else exec /usr/bin/perl -x $0 ${1+"$@"}; fi;'
   if 0;
#!/usr/bin/perl
use strict;
use CGI ':standard';




# ************************   Declaration of Variables   *****************************************
my $first;
my $last;
my $site_code;
my $site_no;
my $month;
my $day;
my $year;
my $time;
my $atemp;
my $wtemp;
my $secchi;
my $depth;
my $salinity;
my $ph;
my $weather;
my $surface;
my $color;
my $wind;
my $do;
my $dosat;
my $comments;

# Importation of Variables from previous page "Data Submission" to the cgi script "wq_data2"
$first = param('first');
$last = param('last');
$site_code = param('site_code');
$site_no = param('site_no');
$month = param('month');
$day = param('day');
$year = param('year');
$time = param('time');
$atemp = param('atemp');
$wtemp = param('wtemp');
$secchi = param('secchi');
$depth = param('depth');
$salinity = param('salinity');
$ph = param('ph');
$weather = param('weather');
$surface = param('surface');
$color = param('color');
$wind = param('wind');
$do = param('do');
$dosat = param('dosat');
$comments = param('comments');




# ************************   Writing Data into the Database   **********************************
    
    open (DATABASE, ">>../database/wqdata/data$year$month.csv");
    print DATABASE "$site_code$site_no,$month/$day/$year,$time,$atemp,$wtemp,$secchi,$depth,$salinity,$ph,$do,$dosat,$weather,$surface,$color,$wind,$first,$last,$comments\n";
    
    close (DATABASE);
   



# ************************   Allerting in case of Low D.O.   ********************************** 
if($do<3)
   {
    mime();
    print qq(
    <HTML>
    <HEAD>
    <TITLE>MRC - Allert - Low D.O.</TITLE>
    </HEAD>
    <body leftmargin=0 marginwidth=0 topmargin=0 marginheight=0 bgcolor=FFE0C0>
    <SCRIPT language=JavaScript src="../java/parameter.js" type=text/javascript></SCRIPT>
    <SCRIPT language=JavaScript src="../java/menu.js" type=text/javascript></SCRIPT>
    
    <TABLE border=0 cellPadding=0 cellSpacing=0 width="100%">
      <TR>
        <TD background=../pictures/background.gif height=58 vAlign=bottom width=15><IMG border=0 height=1 src="../pictures/blank.gif" width=15></TD>
        <TD background=../pictures/logo_top.gif vAlign=top width=105><a href="../index.html"><IMG border=0 height=58 src="../pictures/dolphin.gif" width=105></a></TD>
        <TD background=../pictures/background.gif vAlign=center width="100%"><CENTER><font color=red size=5><b>Members-Only Restricted Area</b></font></CENTER>
        </TD>
      </TR>
    </TABLE>
    
    <TABLE background=../pictures/bgblack.gif border=0 cellPadding=0 cellSpacing=0 width="95%">
      <TR>
        <TD vAlign=top height=32 width=15 align=right bgcolor=white><img src="../pictures/bgblackl.gif" width="15" height="32"></TD>
        <TD vAlign=top><a href="../index.html"><IMG border=0 height=32 src="../pictures/logo_bottom.gif" width=105 valign="top"></a></TD>
        <TD width=100%><img src="../pictures/blank.gif" width="635" height="1"></td>
        <TD height=32 width=13><img src="../pictures/bgblackr.gif" width="13" height="32">
        </TD>
      </TR>
    </TABLE>
    <br><br>
    <table width=80% bgcolor="yellow" border="0" align="center"><tr><td align="center">
    <b>$first&nbsp;$last</b><br><br>
    <br><b>Your <font color=red>Dissolved Oxygen</font> Value (<font color=red>$do mg/l</font>) is very low. A problem may be developing in your area. If possible please send an alert to lagoonwatch\@mrcirl.org by e-mail and retest just D.O. in the morning within a couple of days, reporting that result also by e-mail.  Also watch for and report any fish kills etc.  The fish kill hotline number is 1-800-636-0511. <br></b><br><br>
    <form method=post action="../cgi-bin/wq_data3.cgi">
    <input type="submit" value="OK">
    <input type="hidden" name="first" value="$first">
    <input type="hidden" name="last" value="$last">
    </form>
    </td></tr></table>

    )
    }




else{
# *************************   Print Success Page   *********************************************
    mime();
    print qq(
    <HTML>
    <HEAD>
    <TITLE>MRC - Water Quality Data Submitted Successfully</TITLE>
    </HEAD>
    <body leftmargin=0 marginwidth=0 topmargin=0 marginheight=0 bgcolor=FFE0C0>
    <SCRIPT language=JavaScript src="../java/parameter.js" type=text/javascript></SCRIPT>
    <SCRIPT language=JavaScript src="../java/menu.js" type=text/javascript></SCRIPT>
    
    <TABLE border=0 cellPadding=0 cellSpacing=0 width="100%">
      <TR>
        <TD background=../pictures/background.gif height=58 vAlign=bottom width=15><IMG border=0 height=1 src="../pictures/blank.gif" width=15></TD>
        <TD background=../pictures/logo_top.gif vAlign=top width=105><a href="../index.html"><IMG border=0 height=58 src="../pictures/dolphin.gif" width=105></a></TD>
        <TD background=../pictures/background.gif vAlign=center width="100%"><CENTER><font color=red size=5><b>Members-Only Restricted Area</b></font></CENTER>
        </TD>
      </TR>
    </TABLE>
    
    <TABLE background=../pictures/bgblack.gif border=0 cellPadding=0 cellSpacing=0 width="95%">
      <TR>
        <TD vAlign=top height=32 width=15 align=right bgcolor=white><img src="../pictures/bgblackl.gif" width="15" height="32"></TD>
        <TD vAlign=top><a href="../index.html"><IMG border=0 height=32 src="../pictures/logo_bottom.gif" width=105 valign="top"></a></TD>
        <TD width=100%><img src="../pictures/blank.gif" width="635" height="1"></td>
        <TD height=32 width=13><img src="../pictures/bgblackr.gif" width="13" height="32">
        </TD>
      </TR>
    </TABLE>
    <br><br>
    <center><font size=4 color=red>$first&nbsp;$last, your data have been submitted successfully!<br><br>
    Thank You<br><br><hr width=50%></font><br> If you want to print your data, please click <b> browser's "back" button </b> to go back to the previous page.<br> </center><br>
    

<table width=80% align=center><tr><td>
<p align=justify><form method=post action="../cgi-bin/getaddress.cgi">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please remember that you can now have access to historical <a href="../water/watrdata.html">water quality data and maps</a> on this website. Water Quality Data will be updated monthly. 
You can also check out our <a href="../events.html">"Brown Bag Lunches" schedule</a>, the MRC host 3 of those educational events every week (in Grant, Titusville, Satellite Beach, Stuart and Fort Pierce). 
It's free, and no one walks away from a brown bag without learning something! <br><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$first, as a MRC member and a water quality volunteer monitor, you really make a difference by helping us protect and restore the environment of the Indian River Lagoon. 
But did you know that the MRC also has plenty of other volunteer opportunities? 
You can help us restore the natural shoreline habitats by planting mangroves along the Lagoon, poting mangrove propagules in our greenhouse, or remove exotic vegetation such as pepper trees. 
We host events every week. If you wish to receive our weekly schedule, please enter your e-mail address:
<input type="text" size="30" name="address" tabindex=1>
<input type="submit" value="Submit">
<input type="hidden" name="first" value="$first">
<input type="hidden" name="last" value="$last">
</form></p></td></tr></table>
<hr width=50%><br>
    
    <table width=60% align=center cellpadding=10><tr><td align=center>
    <a href="../members/dataentry.html">Submit Other Data</a></td><td align=center>
    <a href="../members/qa.html">Submit QA Data</a></td><td align=center>
    <a href="http://www.mrcirl.org">Exit Members-Only Restricted Area</a></td></tr></table>
    </center>
    <br><br>
    
    <hr width=100%>
    <table width=100% border=0>
    <tr><td align=left valign=top>
    <font size=1 face="arial">
    &#169; 2002 Marine Resources Council of East Florida
    </font>
    </td></tr></table>
    </BODY></html>
    );
 
}


# ************************   List of Subroutines   *********************************************

sub mime {
    print "Content-type: text/html\n\n";
}



# ************************   End Scritp "wq_data2.cgi"   ****************************************

# *****     Created December 15 2002  -  Damien Sanfilippo  -  MRC     *******************
# *****     Last Updated November 03 2006  -  Michael Wielenga  -  MRC     *********************
