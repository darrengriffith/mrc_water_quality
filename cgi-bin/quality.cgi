#!/bin/sh                                                                                                                                                                                               
 eval 'if [ -x /usr/local/cpanel/3rdparty/bin/perl ]; then exec /usr/local/cpanel/3rdparty/bin/perl -x -- $0 ${1+"$@"}; else exec /usr/bin/perl -x $0 ${1+"$@"}; fi;'
   if 0;
#!/usr/bin/perl
use strict;
use CGI;

# ************************   Declaration of Variables   *****************************************
# Load up post data
my $q = new CGI;

my $first = $q->param('first');
my $last= $q->param('last');
my $site_code = $q->param('site_code');
my $site_no = $q->param('site_no');
my $month = $q->param('month');
my $day = $q->param('day');
my $year = $q->param('year');
my $time = $q->param('time');
my $salinity = $q->param('salinity');
my $ph = $q->param('ph');
my $effort = $q->param('effort');
my $kitNumber = $q->param('kitNumber');
my $sampleId = $q->param('sampleId');
#my $do = $q->param('do');
#my $dosat = $q->param('dosat');
my $comments = $q->param('comments');

# 
# To help prevent duplicate entries, only accept POST requests 
# Still assuming the web form will be doing all validation.
# TODO: consider Text:CSV use to escape posted data
#
if ("GET" eq $q->request_method) {
  print 
    $q->header,
    $q->start_html('Error'),
    $q->h1('Error'),
    $q->p('Unable to process your request.');
  print
    $q->end_html;
  exit;
}

# ************************   Writing Data into the Database   **********************************
open (DATABASE, ">>../database/qadata/data$year$month.csv");
print DATABASE "$site_code$site_no,$month/$day/$year,$time,$salinity,$ph,$first,$last,$effort,$kitNumber,$sampleId,$comments\n";
close (DATABASE);
   
# *************************   Print Success Page   *********************************************
print 
  $q->header,
  $q->start_html(
    -title=> 'MRC - Water QA Data Submitted Successfully'),
  $q->p(qq (Thank you $first. Your data has been submitted.));

# dump values for the moment.
print 
    $q->start_table,
    $q->Tr($q->th('Parameter'), $q->th('Value'));

for my $p ($q->param) {
  print $q->Tr($q->td($p), $q->td($q->param($p)));
}
print $q->end_table;

print
  $q->end_html;
